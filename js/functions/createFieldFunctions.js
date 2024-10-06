/*
Copyright © 2024 Christos Chartomatsidis. 

This file is part of Practical JSON Editor.

"Practical JSON Editor" is free software: you can redistribute it and/or modify
it under the terms of the Creative Commons Attribution-ShareAlike 4.0 International License.

You should have received a copy of the Creative Commons Attribution-ShareAlike 4.0 International License
along with this program. If not, see <https://creativecommons.org/licenses/by-sa/4.0/>.

This software is provided on an "as-is" basis, meaning without any warranties or guarantees of any kind. 

You must give appropriate credit , provide a link to the license, and indicate if changes were made . You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
*/
const fieldTemplates = {};

export const initFieldTemplates = () => {
  fieldTemplates.object = $("#object-template").html();
  fieldTemplates.array = $("#array-template").html();
  fieldTemplates.textInput = $("#textinput-template").html();
  fieldTemplates.textArea = $("#textarea-template").html();
 // fieldTemplates.numberInput = $("#numberinput-template").html();
  fieldTemplates.booleanField = $("#boolean-template").html();
};

export const createFields = (fieldName, selectedOption, holdingContainer,indexNumber=null) => {
  switch (selectedOption) {
    case "object":
      createObjectField(fieldName, holdingContainer,indexNumber);
      break;
    case "text":
      createTextInputField(fieldName, "", holdingContainer,indexNumber);
      break;
    case "textarea":
      createTextArea(fieldName, "", holdingContainer,indexNumber);
      break;
   /* case "number":
      createNumberInputField(fieldName, "", holdingContainer);
      break;*/
    case "boolean":
      createBooleanField(fieldName, false, holdingContainer,indexNumber);
      break;
    case "array":
      createArrayField(fieldName, holdingContainer,indexNumber);
      break;
  }
};

export const createObjectField = (fieldKey, parentContainer,indexNumber=null) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.object;
  let elementValues = {
    key: fieldKey,
    hasLabel: function () {
      return this.key !== "";
    },
  };
    // Use Mustache to render the template with values
    let renderedTemplate = Mustache.render(templateElement, elementValues);

    // If indexNumber is not null, insert after the child at that index
    if (indexNumber !== null) {
      $(parentContainer).children().eq(indexNumber).before(renderedTemplate);
    } else {
      $(parentContainer).append(renderedTemplate);
    }
  return fieldinput;
};

export const createArrayField = (fieldKey, parentContainer,indexNumber=null) => {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = fieldTemplates.array;
  let elementValues = {
    key: fieldKey,
    hasLabel: function () {
      return this.key !== "";
    },
  };
    // Use Mustache to render the template with values
    let renderedTemplate = Mustache.render(templateElement, elementValues);

    // If indexNumber is not null, insert after the child at that index
    if (indexNumber !== null) {
      $(parentContainer).children().eq(indexNumber).before(renderedTemplate);
    } else {
      $(parentContainer).append(renderedTemplate);
    }
  return fieldinput;
};

export const createTextInputField = (fieldKey, fieldValue = "", parentContainer,indexNumber=null) => {
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
    // Use Mustache to render the template with values
    let renderedTemplate = Mustache.render(templateElement, elementValues);

    // If indexNumber is not null, insert after the child at that index
    if (indexNumber !== null) {
      $(parentContainer).children().eq(indexNumber).before(renderedTemplate);
    } else {
      $(parentContainer).append(renderedTemplate);
    }
  return fieldinput;
};

export const createTextArea = (fieldKey, fieldValue = "", parentContainer,indexNumber=null) => {
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
    // Use Mustache to render the template with values
    let renderedTemplate = Mustache.render(templateElement, elementValues);

    // If indexNumber is not null, insert after the child at that index
    if (indexNumber !== null) {
      $(parentContainer).children().eq(indexNumber).before(renderedTemplate);
    } else {
      $(parentContainer).append(renderedTemplate);
    }
  return fieldinput;
};

/*
export const createNumberInputField = (fieldKey, fieldValue, parentContainer,indexNumber=null) => {
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
*/

export const createBooleanField = (fieldKey, fieldValue, parentContainer,indexNumber=null) => {
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
   // Use Mustache to render the template with values
   let renderedTemplate = Mustache.render(templateElement, elementValues);

   // If indexNumber is not null, insert after the child at that index
   if (indexNumber !== null) {
     $(parentContainer).children().eq(indexNumber).before(renderedTemplate);
   } else {
     $(parentContainer).append(renderedTemplate);
   }
  return fieldinput;
};

