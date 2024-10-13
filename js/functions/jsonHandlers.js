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
import * as lazy from "./lazyLoadHandler.js";

const selectors = {
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
  mainContainer: "#mainContainer",
};

// creates json object from the input fields
export const createJsonObj = (holdingContainer) => {
  // creates lists that refer to labels and the corresponding inputs
  // the lists must ALWAYS have the same length!!!
  const labels = $(holdingContainer).children().children("label");
  const inputs = $(holdingContainer).children().children("input,textarea,.obj-container, .array-container");

  // creates empty json obj
  let data = {};
  //populates fields of the object

  for (let i = 0; i < labels.length; i++) {
    // the key is the label
    const key = $(labels[i]).text();
    // the value depends on the type of the input
    let value;
    if (inputs[i].type === "checkbox") {
      // for boolean fields
      if (inputs[i].checked) {
        value = true;
      } else {
        value = false;
      }
    }

    const isNull = $(inputs[i]).val() === "";
    const isNumber = /^-?[0-9]+(\.[0-9]+)?$/.test($(inputs[i]).val());

    if (inputs[i].type === "text" || inputs[i].type === "textarea") {
      console.log($(inputs[i]).val());
      console.log(parseInt($(inputs[i]).val()));
      if (isNull) {
        value = null;
      } else if (isNumber) {
        value = Number($(inputs[i]).val());
      } else {
        value = $(inputs[i]).val();
      }
    }
    if (inputs[i].classList.contains("obj-container")) {
      holdingContainer = inputs[i];
      value = createJsonObj(inputs[i]);
    }
    if (inputs[i].classList.contains("array-container")) {
      holdingContainer = inputs[i];
      value = fromArrayToJson(inputs[i]);
    }
    data[key] = value;
  }
  // arrays have unlabeled fields
  if (labels.length === 0 && inputs.length > 0) {
    for (let i = 0; i < inputs.length; i++) {
      holdingContainer = inputs[i];
      data = fromArrayToJson(inputs[i]);
    }
  }
  return data;
};

// transforms unlabeled fields from an array to json fields
export const fromArrayToJson = (arrayContainer) => {
  const returnedArray = [];
  const inputs = $(arrayContainer).children().children("input,textarea,.obj-container, .array-container");

  for (let i = 0; i < inputs.length; i++) {
    let value;
    if (inputs[i].classList.contains("array-container")) {
      // arrays
      value = fromArrayToJson(inputs[i]);
    } else if (inputs[i].classList.contains("obj-container")) {
      //objects
      value = createJsonObj(inputs[i]);
    } else if (inputs[i].type === "checkbox") {
      // boolean fields
      if (inputs[i].checked) {
        value = true;
      } else {
        value = false;
      }
    } else {
      const isNull = $(inputs[i]).val() === "";
      const isNumber = /^-?[0-9]+(\.[0-9]+)?$/.test($(inputs[i]).val());
      if (isNull) {
        value = null;
      } else if (isNumber) {
        value = Number($(inputs[i]).val());
      } //number
      else {
        value = $(inputs[i]).val();
      } // text, textarea
    }
    returnedArray.push(value);
  }
  return returnedArray;
};

/*
// creates fields for the loaded json file
export const printLoadedJson = (json, parentContainer) => {

  const fragment = new DocumentFragment();
  createFragment();
  $(parentContainer).append(fragment)
  lazy.lazyLoad();
  $("label").each(function () {
    if (!isNaN($(this).text())) {
      $(this).remove();
    }
  });

  function createFragment() {
    for (let key in json) {
      if (Array.isArray(json[key]) || (typeof json[key] === "object" && json[key] != null)) {
        if (Array.isArray(json[key])) {
          $(parentContainer).val("array");
          createField.createArrayField(key, parentContainer);
          let arrayContainer = $(parentContainer).find(`#${key}`);
          printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
        } else {
          $(parentContainer).val("object");
          createField.createObjectField(key, parentContainer);
          let arrayContainer = $(parentContainer).find(`#${key}`);
          printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
        }
      } else {
        //  console.log(`${key}: ${json[key]}`); // Print the field
        if (typeof json[key] === "string") {
          if (json[key].length <= 20) {
            $(parentContainer).val("text");
            createField.createTextInputField(key, json[key], parentContainer); // small texts
          } else {
            $(parentContainer).val("textarea");
            createField.createTextArea(key, json[key], parentContainer); // longer texts
          }
        } else if (typeof json[key] === "number") {
          $(parentContainer).val("number");
          createField.createNumberInputField(key, json[key], parentContainer);
        }
        if (typeof json[key] === "boolean") {
          $(parentContainer).val("boolean");
          createField.createBooleanField(key, json[key], parentContainer);
        }
      }
    }
  }
};
*/

// creates json from object and downloads it
export const saveJson = (obj) => {
  const data = JSON.stringify(obj, null, 2); // Converts the object to a formatted JSON string
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileType = getFileType($(selectors.fileNameInput).val());
  // if the file type in the file name field is other than json, then append '.json'
  link.download = fileType === "json" ? $(selectors.fileNameInput).val() : $(selectors.fileNameInput).val() + ".json";
  link.click();
  URL.revokeObjectURL(url); // Release the object URL when done
};

// gets the filetype extenstion
export const getFileType = (filename) => {
  return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
};

//   iterative version creates bug: it does not correctly set the value of parent array depending on the type of children, so that further adding does not work properly
export const printLoadedJson = (json, x) => {
  const fragment = new DocumentFragment();
  createFragment(fragment);
  $(x).append(fragment);
  lazy.lazyLoad();
  $("label").each(function () {
    if (!isNaN($(this).text())) {
      $(this).remove();
    }
  });

  function createFragment(parentContainer) {
    let stack = [];
    let current = { json, parentContainer };
    stack.push(current);

    while (stack.length > 0) {
      current = stack.pop();
      json = current.json;
      parentContainer = current.parentContainer;
      for (let key in json) {
        const isNull = json[key] === null;
        if (Array.isArray(json[key]) || (typeof json[key] === "object" && !isNull)) {
          if (Array.isArray(json[key])) {
            $(parentContainer).val("array");
            createField.createArrayField(key, parentContainer);
            let arrayContainer = $(parentContainer).find(`#${key}`);
            stack.push({
              json: json[key],
              parentContainer: arrayContainer,
            });
          } else {
            $(parentContainer).val("object");
            createField.createObjectField(key, parentContainer);
            let arrayContainer = $(parentContainer).find(`#${key}`);
            stack.push({
              json: json[key],
              parentContainer: arrayContainer,
            });
          }
        } else {
          if (typeof json[key] === "string" || typeof json[key] === "number"|| isNull) {
            if (typeof json[key] === "number"||isNull || json[key].length <= 20) {
              if (isNull) {
                json[key] = "";
              }
              createField.createTextInputField(key, json[key], parentContainer);
            } else {
              createField.createTextArea(key, json[key], parentContainer);
            }
          } /*else if (typeof json[key] === "number") {
            //     $(parentContainer).val("number");
            createField.createNumberInputField(key, json[key], parentContainer);
          }*/
          if (typeof json[key] === "boolean") {
            //     $(parentContainer).val("boolean");
            createField.createBooleanField(key, json[key], parentContainer);
          }
        }
      }
    }
    //was here
  }
};
//*/
