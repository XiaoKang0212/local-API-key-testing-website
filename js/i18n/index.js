(function() {
  const DEFAULT_LANGUAGE = 'en';

  function getDictionary(language) {
    const languages = window.I18N_LANGUAGES || {};
    return languages[language] || null;
  }

  function getNestedValue(source, key) {
    return key.split('.').reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), source);
  }

  function interpolate(template, params = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, name) => (
      params[name] === undefined || params[name] === null ? '' : String(params[name])
    ));
  }

  function resolveLanguage(language) {
    const languages = window.I18N_LANGUAGES || {};
    if (language && languages[language]) return language;
    if (language) {
      const base = Object.keys(languages).find((item) => item.toLowerCase().startsWith(String(language).toLowerCase()));
      if (base) return base;
    }
    return DEFAULT_LANGUAGE;
  }

  function t(key, params = {}, language) {
    const activeLanguage = resolveLanguage(language || window.__APP_LANGUAGE__ || DEFAULT_LANGUAGE);
    const active = getDictionary(activeLanguage);
    const fallback = getDictionary(DEFAULT_LANGUAGE) || {};
    const value = getNestedValue(active, key);
    const fallbackValue = getNestedValue(fallback, key);
    const result = value !== undefined ? value : fallbackValue;
    return interpolate(result !== undefined ? result : key, params);
  }

  function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll('[data-i18n-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
  }

  function setLanguage(language) {
    const resolved = resolveLanguage(language);
    window.__APP_LANGUAGE__ = resolved;
    document.documentElement.lang = resolved;
    applyI18n(document);
    document.dispatchEvent(new CustomEvent('app-language-changed', { detail: { language: resolved } }));
    return resolved;
  }

  window.I18N = {
    DEFAULT_LANGUAGE,
    applyI18n,
    resolveLanguage,
    setLanguage,
    t,
  };

  window.t = t;
})();
