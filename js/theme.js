// Theme Management System
// Handles light/dark mode switching

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    // Initialize theme system
    init() {
        this.applyTheme(this.currentTheme);
        this.setupListeners();
    }

    // Get stored theme from localStorage
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    // Get system preferred theme
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Update theme toggle icon
    updateThemeIcon() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            if (this.currentTheme === 'dark') {
                toggle.textContent = '☀️';
                toggle.title = 'Switch to Light Mode';
            } else {
                toggle.textContent = '🌙';
                toggle.title = 'Switch to Dark Mode';
            }
        });
    }

    // Setup event listeners
    setupListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Setup theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-toggle')) {
                this.toggleTheme();
            }
        });
    }
}

// Create global theme manager instance
const themeManager = new ThemeManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeManager;
}
