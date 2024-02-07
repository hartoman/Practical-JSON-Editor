const fieldTemplates = {};

export const initFieldTemplates = () => {
  fieldTemplates.object = $("#object-template").html();
  fieldTemplates.array = $("#array-template").html();
  fieldTemplates.textInput = $("#textinput-template").html();
  fieldTemplates.textArea = $("#textarea-template").html();
  fieldTemplates.numberInput = $("#numberinput-template").html();
  fieldTemplates.booleanField = $("#boolean-template").html();
};

export const createFields = (fieldName, selectedOption, holdingContainer) => {
  switch (selectedOption) {
    case "object":
      createObjectField(fieldName, holdingContainer);
      break;
    case "text":
      createTextInputField(fieldName, "", holdingContainer);
      break;
    case "textarea":
      createTextArea(fieldName, "", holdingContainer);
      break;
    case "number":
      createNumberInputField(fieldName, "", holdingContainer);
      break;
    case "boolean":
      createBooleanField(fieldName, false, holdingContainer);
      break;
    case "array":
      createArrayField(fieldName, holdingContainer);
      break;
  }
};

export const createObjectField = (fieldKey, parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.object;
  let elementValues = {
    key: fieldKey,
    hasLabel: function () {
      return this.key !== "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

export const createArrayField = (fieldKey, parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.array;
  let elementValues = {
    key: fieldKey,
    hasLabel: function () {
      return this.key !== "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

export const createTextInputField = (fieldKey, fieldValue = "", parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.textInput;
  let elementValues = {
    key: fieldKey,
    value: fieldValue,
    hasLabel: function () {
      return this.key !== "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

export const createTextArea = (fieldKey, fieldValue = "", parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.textArea;
  let elementValues = {
    key: fieldKey,
    value: fieldValue,
    hasLabel: function () {
      return this.key !== "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

export const createNumberInputField = (fieldKey, fieldValue, parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.numberInput;
  let elementValues = {
    key: fieldKey,
    value: fieldValue,
    hasLabel: function () {
      return this.key !== "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

export const createBooleanField = (fieldKey, fieldValue, parentContainer) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.booleanField;
  let elementValues = {
    key: fieldKey,
    value: fieldValue,
    hasLabel: function () {
      return this.key !== "";
    },
    checked: function () {
      return this.value ? "checked" : "";
    },
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
};

