import * as createField from './createFieldFunctions.js'
import * as jsonHandlers from './jsonHandlers.js';

const selectors = {
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
  mainContainer: "#mainContainer",
}

export const isArray = (inputContainer) => { 
    return $(inputContainer).parent().children(".array-container").length;
}

export const isObjectInsideArray=(holdingContainer)=> {
  // creating field in an object that is an array element,
  let parentElement = $(holdingContainer).parent();
  let containingarray = $(holdingContainer).parents()[2];
  if ($(parentElement).children(".obj-container").length && $(containingarray).children(".array-container").length) {
    // if a label with the same name already exists in some of the objects, it is removed
    return true;
  } else {
    // solo object field outside of array
    return false;
  }
}
