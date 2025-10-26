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

    // Announce message to screen readers
    function announce(message) {
        const liveRegion = $('#ariaLive');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
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
            this.applyMode('numeric', { announce: false });
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
                announce('Cannot switch modes during selection');
                return;
            }
            this.applyMode(mode, { announce: true });
        },
        applyMode(mode, { announce: doAnnounce } = { announce: true }) {
            this.current = mode;
            // Update button pressed states
            if (this.els.toggleButtons) {
                this.els.toggleButtons.forEach(btn => {
                    const m = btn.getAttribute('data-mode');
                    btn.setAttribute('aria-pressed', m === mode ? 'true' : 'false');
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
            if (doAnnounce) {
                announce(mode === 'numeric' ? 'Switched to Player Count mode' : 'Switched to Finger Pick mode');
            }
        },
        setSelectionActive(active) {
            this.selectionActive = !!active;
        }
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
            console.log('Game Order Generator initialized');
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

            console.log('Event listeners attached');
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
                announce(message);
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
            
            // Announce to screen readers
            announce(`Turn order generated: ${orderString}`);
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
        getCurrentMode: () => ModeManager.current
    };
})();
