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
import * as lazy from './lazyLoadHandler.js';

const selectors = {
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
  mainContainer: "#mainContainer",
  topFoldUnfoldBtn: "#topCollapseAllBtn",
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

export const onlyUnfold=(element)=> {
  const targetContainer = $(element).children(".obj-container, .array-container");
  const buttons = $(element).children(".add-button, .clear-button, .copy-button, .paste-button");
  const foldbun = $(element).children(".icon-expand");

  if ($(foldbun).val() === "fold") {
    $(foldbun).addClass("icon-fold");
    $(foldbun).removeClass("icon-expand");
    $(foldbun).val("expand");
    $(foldbun).attr("data-tooltiptext", "Fold");
    targetContainer.removeClass("d-none");
    lazy.lazyLoad();
    buttons.show();
  }
}

export const setTopFoldBtnToFolded=()=>{
  $(selectors.topFoldUnfoldBtn).addClass("icon-fold");
  $(selectors.topFoldUnfoldBtn).removeClass("icon-expand");
  $(selectors.topFoldUnfoldBtn).val("fold");
  $(selectors.topFoldUnfoldBtn).attr("data-tooltiptext", "Fold all");
}