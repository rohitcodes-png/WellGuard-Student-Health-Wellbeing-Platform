// Internationalization (i18n) System
// Manages multi-language support across the entire application

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
    this.fallbackLanguage = 'en';
  }

  // Load translation file for a specific language
  async loadLanguage(lang) {
    try {
      const response = await fetch(`../assets/translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load language: ${lang}`);
      }
      this.translations[lang] = await response.json();
      return true;
    } catch (error) {
      console.error(`Error loading language ${lang}:`, error);
      return false;
    }
  }

  // Initialize i18n system
  async init(lang = null) {
    const targetLang = lang || this.currentLanguage;
    
    // Load fallback language first
    await this.loadLanguage(this.fallbackLanguage);
    
    // Load target language if different from fallback
    if (targetLang !== this.fallbackLanguage) {
      await this.loadLanguage(targetLang);
    }
    
    this.currentLanguage = targetLang;
    this.translatePage();
  }

  // Get translation for a key
  t(key, defaultValue = '') {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        // Fallback to default language
        translation = this.translations[this.fallbackLanguage];
        for (const fk of keys) {
          if (translation && translation[fk] !== undefined) {
            translation = translation[fk];
          } else {
            return defaultValue || key;
          }
        }
        break;
      }
    }
    
    return translation || defaultValue || key;
  }

  // Translate all elements on the page with data-i18n attribute
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Handle placeholders
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Translate elements with data-i18n-html (allows HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      element.innerHTML = this.t(key);
    });

    // Update language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      langSelect.value = this.currentLanguage;
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  }

  // Change language
  async changeLanguage(lang) {
    if (lang === this.currentLanguage) return;
    
    await this.loadLanguage(lang);
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.translatePage();
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
    ];
  }
}

// Create global i18n instance
const i18n = new I18n();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}
