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
