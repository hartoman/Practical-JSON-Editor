import * as createField from "./createFieldFunctions.js";

export const renameAllObjectsInArray = (parentContainer, oldname, newName) => {
  let siblingObjects = $(parentContainer).children().children(".obj-container");

  siblingObjects.map(function () {
    let preexistingLabels = $(this).children().children("label");
    let fieldwithsamename = preexistingLabels.filter(function () {
      return $(this).text() === oldname;
    });
    if (fieldwithsamename.length) {
      $(fieldwithsamename).text(newName);
    }
  });
};

export const removeFromAllObjectsInArray = (parentContainer, fieldName) => {
  let siblingObjects = $(parentContainer).children().children(".obj-container");

  siblingObjects.map(function () {
    let preexistingLabels = $(this).children().children("label");
    let fieldwithsamename = preexistingLabels.filter(function () {
      return $(this).text() === fieldName;
    });
    if (fieldwithsamename.length) {
      $(fieldwithsamename).parent().remove();
    }
  });
};

export const addToAllObjectsInArray = (parentContainer, fieldName, selectedOption) => {
  let siblingObjects = $(parentContainer).children().children(".obj-container");

  siblingObjects.map(function () {
    // choosing to create the field in all objects of array
    createField.createFields(fieldName, selectedOption, $(this));
  });
};
