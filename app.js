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

    // Main module
    const GameOrderGenerator = {
        elements: {},
        lastValidCount: null,

        init() {
            this.cacheElements();
            this.attachEventListeners();
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
        generateTurnOrder
    };
})();
