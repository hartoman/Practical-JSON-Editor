import * as lazy from './lazyLoadHandler.js';

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


export const saveObjectToStorage=(obj,key)=> {
  const jsonString = JSON.stringify(obj);
  localStorage.setItem(key, jsonString);
}

export const loadObjectFromStorage=(key)=> {
  const storedString = localStorage.getItem(key);
  const obj = JSON.parse(storedString);
  return obj;
}

export const clearLocalStorage=()=> {
  localStorage.clear()
}

export const toggleFold=(element)=> {
  const targetContainer = $(element).children(".obj-container, .array-container");
  const buttons = $(element).children(".add-button, .clear-button, .copy-button, .paste-button");
  const foldbun = $(element).children(".icon-fold, .icon-expand");

  //alternates between two icons
  $(foldbun).toggleClass("icon-fold icon-expand");

  if ($(foldbun).val() === "fold") {
    $(foldbun).val("expand");
    $(foldbun).attr("data-tooltiptext", "Fold");
    targetContainer.removeClass("d-none");
    lazy.lazyLoad();
    buttons.show();
  } else {
    $(foldbun).val("fold");
    $(foldbun).attr("data-tooltiptext", "Expand");
    targetContainer.addClass("d-none");
    buttons.hide();
  }
}