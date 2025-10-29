/**
 * Game Order Generator
 * Simple static web app to generate random turn order for board games
 */

(function() {
    'use strict';

    // DOM Utilities
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // Fisher-Yates shuffle algorithm - unbiased O(N) permutation
    function fisherYatesShuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Generate turn order array [1..N] and shuffle
    function generateTurnOrder(playerCount) {
        const order = Array.from({ length: playerCount }, (_, i) => i + 1);
        return fisherYatesShuffle(order);
    }

    // Mode Manager (Phase2 T006-T010): manages numeric vs finger panel visibility & guards during selection
    const ModeManager = {
        current: 'numeric',
        selectionActive: false, // will be toggled later during selection phases
        els: {},
        init() {
            this.els.toggleButtons = $$('.mode-toggle .toggle-btn');
            this.els.panels = {
                numeric: document.querySelector('[data-mode-panel="numeric"]'),
                finger: document.querySelector('[data-mode-panel="finger"]')
            };
            this.attachEvents();
            this.applyMode('numeric');
            // Load persisted mode (T044)
            let initial = 'numeric';
            try {
                const stored = localStorage.getItem('gom:lastMode');
                if (stored === 'finger' || stored === 'numeric') initial = stored;
            } catch(_) {}
            this.applyMode(initial);
        },
        attachEvents() {
            if (this.els.toggleButtons) {
                this.els.toggleButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const targetMode = btn.getAttribute('data-mode');
                        this.requestModeChange(targetMode);
                    });
                });
            }
        },
        requestModeChange(mode) {
            if (mode === this.current) return;
            if (this.selectionActive) {
                // Guard mode switch mid-selection (spec FR-015 placeholder)
                return;
            }
            this.applyMode(mode);
        },
        applyMode(mode) {
            this.current = mode;
            // Update button active states
            if (this.els.toggleButtons) {
                this.els.toggleButtons.forEach(btn => {
                    const m = btn.getAttribute('data-mode');
                    if (m === mode) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
            // Toggle panels
            Object.entries(this.els.panels).forEach(([key, panel]) => {
                if (!panel) return;
                if (key === mode) {
                    panel.classList.remove('hidden', 'mode-panel-hidden');
                    panel.classList.add('mode-panel-active');
                } else {
                    panel.classList.add('hidden', 'mode-panel-hidden');
                    panel.classList.remove('mode-panel-active');
                }
            });
        },
        setSelectionActive(active) {
            this.selectionActive = !!active;
            if (!this.selectionActive) {
                try { localStorage.setItem('gom:lastMode', this.current); } catch(_) {}
            }
        }
    };

    // Touch/Finger Manager (US1 T011-T013 baseline)
    const FingerManager = {
        surface: null,
        markersLayer: null,
        touches: new Map(), // pointerId -> { x, y, el }
        maxTouches: (navigator.maxTouchPoints && navigator.maxTouchPoints < 6) ? navigator.maxTouchPoints : 6,
        previousCount: 0,
        rafPending: false,
        autoSelectTimer: null,
        preAnimTimer: null,
        animInterval: null,
        animCycleIndex: 0,
        winnerEl: null,
        config: {
            autoSelectDelay: 2000,
            preAnimationDuration: 500, // ms length of anticipation before winner
            cycleInterval: 110 // ms per marker cycle flash
        },
        init() {
            this.surface = $('#fingerSurface');
            if (!this.surface) return;
            this.resetBtn = $('#fingerResetBtn');
            this.attachEvents();
            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => this.handleResetClick());
            }
        },
        attachEvents() {
            // Use Pointer Events; fallback minimal listeners if not supported
            ['pointerdown','pointerup','pointercancel'].forEach(evt => {
                this.surface.addEventListener(evt, (e) => this.handlePointerEvent(e), { passive: false });
            });
            this.surface.addEventListener('pointermove', (e) => this.handlePointerMove(e));

            // iOS Safari specific gesture events (not standard elsewhere) to suppress pinch
            ['gesturestart','gesturechange','gestureend'].forEach(evt => {
                this.surface.addEventListener(evt, (e) => {
                    e.preventDefault();
                });
            });
        },
        handlePointerEvent(e) {
            if (ModeManager.current !== 'finger') return; // Only active in finger mode
            if (e.type === 'pointerdown') {
                // Prevent default to block implicit multi-touch gestures (Safari zoom/tab switch)
                if (e.cancelable) {
                    e.preventDefault();
                }
                this.addTouch(e);
            } else if (e.type === 'pointerup' || e.type === 'pointercancel') {
                this.removeTouch(e.pointerId);
            }
        },
        handlePointerMove(e) {
            if (ModeManager.current !== 'finger') return;
            const data = this.touches.get(e.pointerId);
            if (!data) return;
            // Store latest coordinates; batch update via rAF (T015)
            data.x = e.clientX;
            data.y = e.clientY;
            this.queueMoveBatch();
        },
        addTouch(e) {
            if (ModeManager.selectionActive) return; // Ignore new touches after selection (T055)
            if (this.touches.size >= this.maxTouches) {
                // Max reached - pulse surface
                this.pulseMax();
                return; // ignore beyond limit
            }
            // Palm-size heuristic (T041): ignore very large contacts (approximate palm)
            const palmThreshold = 140; // px heuristic; typical finger contact ~40-80px
            if ((e.width && e.width > palmThreshold) || (e.height && e.height > palmThreshold)) {
                return;
            }
            if (this.touches.has(e.pointerId)) return;
            const marker = this.createMarker();
            const record = { x: e.clientX, y: e.clientY, el: marker };
            this.touches.set(e.pointerId, record);
            this.positionMarker(marker, record.x, record.y);
            this.updateStatus();
            // Reset button should NOT appear on initial touches anymore (user preference)
        },
        removeTouch(pointerId) {
            const data = this.touches.get(pointerId);
            if (!data) return;
            // Persist winner marker even after lift if selection done (T053)
            if (ModeManager.selectionActive && data.el === this.winnerEl) {
                // Remove from tracking but keep element
                this.touches.delete(pointerId);
            } else {
                data.el.remove();
                this.touches.delete(pointerId);
            }
            this.updateStatus();
            // Do not show reset button until after winner delay
        },
        getActiveMarkers() {
            return Array.from(this.touches.values()).map(r => r.el);
        },
        getActiveRecords() {
            return Array.from(this.touches.values());
        },
        createMarker() {
            const el = document.createElement('div');
            const index = this.touches.size + 1;
            el.className = 'finger-marker finger-color-' + index;
            // Removed visible numeric label (T017 updated) – rely on distinct color.
            this.surface.appendChild(el);
            // Apply active size state (T056)
            el.classList.add('finger-active');
            return el;
        },
        positionMarker(el, x, y) {
            // Position relative to surface bounding rect
            const rect = this.surface.getBoundingClientRect();
            const relX = x - rect.left;
            const relY = y - rect.top;
            // Center offset uses half of element dimensions (now 80px)
            const half = el.offsetWidth / 2;
            el.style.transform = `translate(${relX - half}px, ${relY - half}px)`;
        },
        updateStatus() {
            const count = this.touches.size;
            if (count !== this.previousCount && !ModeManager.selectionActive) {
                this.previousCount = count;
            }
            this.scheduleAutoSelection();
        }
        ,queueMoveBatch() {
            if (this.rafPending) return;
            this.rafPending = true;
            requestAnimationFrame(() => this.flushMoves());
        }
        ,flushMoves() {
            const rect = this.surface.getBoundingClientRect();
            for (const record of this.touches.values()) {
                const relX = record.x - rect.left;
                const relY = record.y - rect.top;
                const half = record.el.offsetWidth / 2;
                record.el.style.transform = `translate(${relX - half}px, ${relY - half}px)`;
            }
            this.rafPending = false;
        }
        ,pulseMax() {
            if (!this.surface) return;
            this.surface.classList.add('finger-max-reached');
            setTimeout(() => {
                this.surface.classList.remove('finger-max-reached');
            }, 450);
        }
        ,pickRandomWinner() {
            const records = this.getActiveRecords();
            if (records.length < 2) {
                return null;
            }
            // Stop any running anticipation animation
            this.stopPreAnimation();
            const idx = secureRandomIndex(records.length);
            const winner = records[idx];
            // Keep winner styling identical to active markers; no special class.
            ModeManager.setSelectionActive(true); // lock mode switching (FR-015)
            this.winnerEl = winner.el;
            // Remove all other markers (T053)
            for (const [pid, record] of Array.from(this.touches.entries())) {
                if (record.el !== winner.el) {
                    record.el.remove();
                    this.touches.delete(pid);
                }
            }
            // T033 (placeholder) Optional future enhancement: play a subtle sound effect here
            // Example stub: // if (Audio.enabled) play('select.mp3');
            // Apply winner pulse animation
            if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                winner.el.classList.add('finger-anim-final');
                winner.el.addEventListener('animationend', () => {
                    winner.el.classList.remove('finger-anim-final');
                }, { once: true });
            } else {
                // Reduced motion emphasis: temporary static outline pulse
                winner.el.classList.add('finger-select-pending');
                setTimeout(() => winner.el.classList.remove('finger-select-pending'), 600);
            }
            this.updateStatus();
            // Delay showing reset button until after short pause (user requested 1–2s)
            if (this.resetBtn) {
                this.resetBtn.classList.add('hidden');
                clearTimeout(this._resetRevealTimer);
                this._resetRevealTimer = setTimeout(() => {
                    if (this.winnerEl && ModeManager.selectionActive) {
                        this.resetBtn.classList.remove('hidden');
                    }
                }, 1500); // 1.5s compromise delay
            }
            return winner;
        }
        ,handleResetClick() {
            this.resetState();
        }
        ,resetState() {
            if (this.autoSelectTimer) {
                clearTimeout(this.autoSelectTimer);
                this.autoSelectTimer = null;
            }
            if (this.preAnimTimer) {
                clearTimeout(this.preAnimTimer);
                this.preAnimTimer = null;
            }
            this.stopPreAnimation();
            for (const record of this.touches.values()) {
                record.el.remove();
            }
            this.touches.clear();
            if (this.winnerEl) {
                this.winnerEl.remove();
            }
            this.winnerEl = null;
            ModeManager.setSelectionActive(false);
            this.previousCount = 0;
            if (this.surface && this.surface.focus) {
                this.surface.focus();
            }
            if (this.resetBtn) this.resetBtn.classList.add('hidden');
        }
        ,scheduleAutoSelection() {
            // Clear existing timers
            if (this.autoSelectTimer) { clearTimeout(this.autoSelectTimer); this.autoSelectTimer = null; }
            if (this.preAnimTimer) { clearTimeout(this.preAnimTimer); this.preAnimTimer = null; }
            // Guard conditions
            if (ModeManager.selectionActive || this.touches.size < 2) return;
            const { autoSelectDelay, preAnimationDuration } = this.config;
            // Schedule winner selection
            this.autoSelectTimer = setTimeout(() => {
                if (!ModeManager.selectionActive && this.touches.size >= 2) {
                    this.pickRandomWinner();
                } else {
                    this.stopPreAnimation();
                }
            }, autoSelectDelay);
            // Schedule anticipation start (avoid negative)
            const startDelay = Math.max(0, autoSelectDelay - preAnimationDuration);
            this.preAnimTimer = setTimeout(() => {
                if (!ModeManager.selectionActive && this.touches.size >= 2) {
                    this.startPreAnimation();
                }
            }, startDelay);
        }
        ,startPreAnimation() {
            // Respect reduced motion
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Reduced motion fallback (T046): apply static indicator instead of cycling animation
                const markers = this.getActiveMarkers();
                if (markers.length < 2) return;
                markers.forEach(m => m.classList.add('finger-select-pending'));
                return;
            }
            // Safety guards
            if (ModeManager.selectionActive || this.animInterval) return;
            const markers = this.getActiveMarkers();
            if (markers.length < 2) return;
            this.animCycleIndex = 0;
            this.animInterval = setInterval(() => {
                const currentMarkers = this.getActiveMarkers();
                if (currentMarkers.length < 2 || ModeManager.selectionActive) {
                    this.stopPreAnimation();
                    return;
                }
                // Remove cycle class from all first to avoid build-up
                currentMarkers.forEach(m => m.classList.remove('finger-anim-cycle'));
                const target = currentMarkers[this.animCycleIndex % currentMarkers.length];
                target.classList.add('finger-anim-cycle');
                this.animCycleIndex++;
            }, this.config.cycleInterval);
        }
        ,stopPreAnimation() {
            if (this.animInterval) {
                clearInterval(this.animInterval);
                this.animInterval = null;
            }
            // Remove cycling class from any markers
            this.getActiveMarkers().forEach(m => {
                m.classList.remove('finger-anim-cycle');
                m.classList.remove('finger-select-pending'); // reduced motion fallback cleanup
            });
        }
        ,updateResetVisibility() { /* legacy noop retained for compatibility; now delayed logic handled in pickRandomWinner */ }
    };

    // Secure random helper (US2 T022/T023)
    function secureRandomIndex(max) {
        if (window.crypto && window.crypto.getRandomValues) {
            const buf = new Uint32Array(1);
            window.crypto.getRandomValues(buf);
            return buf[0] % max;
        }
        console.warn('[finger-mode] Crypto unavailable, falling back to Math.random');
        return Math.floor(Math.random() * max);
    };

    // Main module
    const GameOrderGenerator = {
        elements: {},
        lastValidCount: null,

        init() {
            this.cacheElements();
            this.attachEventListeners();
            // Initialize mode manager after basic elements present
            ModeManager.init();
            // Initialize finger manager (safe even if panel hidden) T011
            FingerManager.init();
            // Removed dev init log (T047)
        },

        cacheElements() {
            this.elements = {
                input: $('#playerCount'),
                generateBtn: $('#generateBtn'),
                errorMsg: $('#playerCountError'),
                resultSection: $('#resultSection'),
                orderDisplay: $('#orderDisplay')
            };
        },

        attachEventListeners() {
            const { input, generateBtn } = this.elements;

            // Generate button click
            if (generateBtn) {
                generateBtn.addEventListener('click', () => this.handleGenerate());
            }

            // Enter key in input field
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleGenerate();
                    }
                });

                // Live validation on input
                input.addEventListener('input', () => this.validateInput());
                input.addEventListener('blur', () => this.validateInput());
            }

            // Removed dev listeners log (T047)
        },

        // Validation rules
        validateInput() {
            const { input, errorMsg, generateBtn } = this.elements;
            if (!input || !errorMsg) return false;

            const value = input.value.trim();
            
            // Clear error initially
            errorMsg.textContent = '';
            
            // Empty input
            if (value === '') {
                this.setError('Please enter a number of players');
                this.disableGenerate(true);
                return false;
            }

            const count = parseInt(value, 10);
            
            // Non-numeric
            if (isNaN(count) || value !== count.toString()) {
                this.setError('Only whole numbers are accepted');
                this.disableGenerate(true);
                return false;
            }

            // Below minimum
            if (count < 2) {
                this.setError('Minimum is 2 players');
                this.disableGenerate(true);
                return false;
            }

            // Above maximum
            if (count > 20) {
                this.setError('Maximum is 20 players');
                this.disableGenerate(true);
                return false;
            }

            // Valid
            this.clearError();
            this.disableGenerate(false);
            return true;
        },

        // Set error message
        setError(message) {
            const { errorMsg } = this.elements;
            if (errorMsg) {
                errorMsg.textContent = message;
            }
        },

        // Clear error message
        clearError() {
            const { errorMsg } = this.elements;
            if (errorMsg) {
                errorMsg.textContent = '';
            }
        },

        // Disable/enable generate button
        disableGenerate(disabled) {
            const { generateBtn } = this.elements;
            if (generateBtn) {
                generateBtn.disabled = disabled;
            }
        },

        // Parse and trim input
        getPlayerCount() {
            const { input } = this.elements;
            if (!input) return null;
            
            const value = input.value.trim();
            if (value === '') return null;
            
            const count = parseInt(value, 10);
            return isNaN(count) ? null : count;
        },

        // Handle generate button click
        handleGenerate() {
            // Validate first
            if (!this.validateInput()) {
                return;
            }

            const count = this.getPlayerCount();
            
            if (count === null || count < 2 || count > 20) {
                return;
            }

            // Store last valid count
            this.lastValidCount = count;

            // Generate and display order
            const order = generateTurnOrder(count);
            this.displayOrder(order);
        },

        // Display the generated order
        displayOrder(order) {
            const { resultSection, orderDisplay } = this.elements;
            
            if (!resultSection || !orderDisplay) return;

            // Format order as comma-separated string
            const orderString = order.join(', ');
            
            // Update display
            orderDisplay.textContent = orderString;
            resultSection.classList.remove('hidden');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GameOrderGenerator.init());
    } else {
        GameOrderGenerator.init();
    }

    // Expose for optional testing
    window.GameOrderGenerator = {
        fisherYatesShuffle,
        generateTurnOrder,
        setSelectionActive: (active) => ModeManager.setSelectionActive(active),
        getCurrentMode: () => ModeManager.current,
        _fingerDebug: () => ({ size: FingerManager.touches.size }) // debug helper (optional)
        ,_fairnessSample: (iterations = 30) => {
            const counts = {};
            const records = FingerManager.getActiveRecords();
            if (records.length < 2) return null;
            for (let i = 0; i < iterations; i++) {
                const idx = secureRandomIndex(records.length);
                counts[idx] = (counts[idx] || 0) + 1;
            }
            console.table(counts);
            return counts;
        }
        ,_fairnessStats: (iterations = 100) => { // T042
            const records = FingerManager.getActiveRecords();
            if (records.length < 2) return null;
            const counts = new Array(records.length).fill(0);
            for (let i = 0; i < iterations; i++) {
                counts[secureRandomIndex(records.length)]++;
            }
            const distribution = counts.map((c,i) => ({ index: i, count: c, pct: (c/iterations*100).toFixed(1) }));
            console.table(distribution);
            return distribution;
        }
    };
})();
