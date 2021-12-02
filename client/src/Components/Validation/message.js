import { defineMessages } from "react-intl";

const messages = defineMessages({
  linkExpired: {
    id: "app.signIn.linkExpired",
    description: "Edit button in Patient Card",
    defaultMessage: "This verification link has expired!",
  },
  somethingWentWrong: {
    id: "app.signIn.somethingWentWrong",
    description: "Edit button in Patient Card",
    defaultMessage: "Something went wrong, please try again.",
  },
  accountVerified: {
    id: "app.signIn.accountVerified",
    description: "Edit button in Patient Card",
    defaultMessage: "Account verified successfully.",
  },
});

export default messages;
