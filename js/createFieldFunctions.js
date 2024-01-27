export const createFields = (fieldName, selectedOption, holdingContainer)=>{
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
  }


export const createObjectField = (fieldKey, parentContainer) => {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#object-template").html();
    let elementValues = {
      key: fieldKey,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
}
/*
function createObjectField(fieldKey, parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#object-template").html();
    let elementValues = {
      key: fieldKey,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }*/
  
  export const createTextInputField = (fieldKey, fieldValue = "", parentContainer)=>{
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#textinput-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }
/*
  function createTextInputField(fieldKey, fieldValue = "", parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#textinput-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }*/

  export const createTextArea = (fieldKey, fieldValue = "", parentContainer)=>{
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#textarea-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }

  /*
  function createTextArea(fieldKey, fieldValue = "", parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#textarea-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }
*/

  export const createNumberInputField = (fieldKey, fieldValue, parentContainer)=>{
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#numberinput-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
}
  
/*

  function createNumberInputField(fieldKey, fieldValue, parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#numberinput-template").html();
    let elementValues = {
      key: fieldKey,
      value: fieldValue,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }
*/

  export const createArrayField = (fieldKey, parentContainer)=>{
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#array-template").html();
    let elementValues = {
      key: fieldKey,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }

  /*
  function createArrayField(fieldKey, parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#array-template").html();
    let elementValues = {
      key: fieldKey,
      hasLabel: function () {
        return this.key !== "";
      },
    };
    $(parentContainer).append(Mustache.render(templateElement, elementValues));
    return fieldinput;
  }
*/

  export const createBooleanField = (fieldKey, fieldValue, parentContainer)=>{
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#boolean-template").html();
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
  }

  /*
  function createBooleanField(fieldKey, fieldValue, parentContainer) {
    let fieldinput = document.createElement("div");
    // Get the template element
    let templateElement = $("#boolean-template").html();
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
  }*/