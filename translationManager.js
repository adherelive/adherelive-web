const path = require("path");
const manageTranslations = require("react-intl-translations-manager").default;

manageTranslations({
  messagesDirectory: path.join(__dirname, "client/build/messages/"),
  translationsDirectory: path.join(__dirname, "client/src/i18n/locales/"),
  languages: ["en", "ar", "es", "hi"]
});
