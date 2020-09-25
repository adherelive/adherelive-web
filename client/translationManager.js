const manageTranslations = require("react-intl-translations-manager").default;

manageTranslations({
    messagesDirectory: "build/messages/src",
    translationsDirectory: "src/i18n/locales/",
    languages: ["en", "hi"] // any language you need
});
