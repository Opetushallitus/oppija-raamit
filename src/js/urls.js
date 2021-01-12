const urls = {
  header: (lang, suffix) => `/oppija-raamit/html/${lang}/header${suffix}.html`,
  footer: (lang) => `/oppija-raamit/html/${lang}/footer.html`,
  cookieModal: (lang) => `/oppija-raamit/html/${lang}/cookie-modal.html`,
  cookieModalNoSdg: (lang) => `/oppija-raamit/html/${lang}/cookie-modal-no-sdg.html`,
  demo: (lang) => `/oppija-raamit/html/${lang}/demo.html`,
};

export default urls;
