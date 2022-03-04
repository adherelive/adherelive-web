import { defineMessages } from "react-intl";

const messages = defineMessages({
  templateName: {
    id: "app.allTemplatesTable.templateName",
    description: "",
    defaultMessage: "Name",
  },
  createdAt: {
    id: "app.allTemplatesTable.createdAt",
    description: "",
    defaultMessage: "Created At",
  },
  createDuplicateMessage: {
    id: "app.allTemplatesTable.createDuplicateMessage",
    description: "",
    defaultMessage: "Are you sure you want to create a duplicate template ?",
  },
  duplicate_text: {
    id: "app.allTemplatesTable.duplicate.text",
    description: "",
    defaultMessage: "Duplicate",
  },
  edit_text: {
    id: "app.allTemplatesTable.edit.text",
    description: "",
    defaultMessage: "Edit",
  },
  emptyTemplateTable: {
    id: "app.patient.table.emptyTemplateTable",
    description: "",
    defaultMessage: "No Template added yet",
  },
});

export default messages;
