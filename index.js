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

import * as modalRemove from "./js/modals/modalRemove.js";
import * as modalRename from "./js/modals/modalRename.js";
import * as modalAdd from "./js/modals/modalAdd.js";
import * as modalClipboard from "./js/modals/modalClipboard.js";
import * as modalOptions from "./js/modals/modalOptions.js";
import * as createField from "./js/functions/createFieldFunctions.js";
import * as jsonHandlers from "./js/functions/jsonHandlers.js";
import * as undoHandlers from "./js/functions/undoHandlers.js";
import * as utils from "./js/functions/utils.js";
import * as gotoHandler from "./js/functions/gotoHandler.js";
import * as searchHandler from "./js/functions/searchHandler.js";
import * as lazy from "./js/functions/lazyLoadHandler.js";

const selectors = {
  everything: "*",
  mainContainer: "#mainContainer",
  // buttons inside objects
  addBtn: ".add-button",
  clearBtn: ".clear-button",
  deleteBtn: ".del-button",
  hideBtn: ".hide-btn",
  foldBtn:".hide-button",
  // top row buttons
  topAddBtnObj: "#topAddBtnObj",
  topAddBtnArray: "#topAddBtnArray",
  topClipboardBtn: "#clipboardBtn",
  topFileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput", // is directly referenced by topFileInputBtn
  topGotoSelectedBtn: "#gotoSelected",
  topGotoTop:"#gotoTop",
  topOptionsBtn: "#optionsBtn",
  topNewBtn: "#newBtn",
  topPasteBtn:"#topPasteBtn",
  topSaveBtn: "#saveBtn",
  topSearchBtn: "#searchBtn",
  topUndoBtn: "#undoBtn",
  topRedoBtn: "#redoBtn",
  topClearAllBtn: "#topClearBtn",
  topFoldUnfoldBtn: "#topCollapseAllBtn",

};

// keeps track of the div that contains the add button
let holdingContainer = $(selectors.mainContainer);
let selectedElement = null;

$(document).ready(function () {
  init();
});

function init() {
  modalOptions.loadSettings()
  bindButtons();
  disableRightClickContextMenu();
  createField.initFieldTemplates();
  toggleSaveBtn(document.getElementById("mainContainer"));
  bindModals();
}

function bindButtons() {
  $(document).on("scroll", function () {
    lazy.lazyLoad();
  });

  // top New File button
  $(selectors.topNewBtn).on("click", function () {

   if( confirm('Unsaved changes will be lost. Proceed? \nThe clipboard content will still be available')){
    holdingContainer = $(selectors.mainContainer);
    undoHandlers.unsetUndo();
    undoHandlers.unsetRedo();
    searchHandler.resetSearch();
    gotoHandler.resetGoto();
    $(selectors.mainContainer).empty();
    $(selectors.fileNameInput).val("new.json");
    }
  });

  // top Add Obj button
  $(selectors.topAddBtnObj).on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    modalAdd.addModal(holdingContainer);
  });

  // top Add Array button
  $(selectors.topAddBtnArray).on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    createField.createArrayField("", holdingContainer);
    lazy.lazyLoad()
  });

  $(selectors.topPasteBtn).on("click", function () {
    const holdingContainerParent = $(selectors.mainContainer).parent();
    modalClipboard.pasteClipboardContentsOnly(holdingContainerParent);
    lazy.lazyLoad()
  });

  // top undo button
  $(selectors.topUndoBtn).on("click", function () {
    undoHandlers.undo();
  });

  // top redo button
  $(selectors.topRedoBtn).on("click", function () {
    undoHandlers.redo();
  });

  // top Clear button
  $(selectors.topClearAllBtn).on("click", function () {
    undoHandlers.unsetRedo();
    undoHandlers.setUndo();
    $(selectors.mainContainer).empty();
  });

  // top Collapse-All button
  $(selectors.topFoldUnfoldBtn).on("click", function () {
    let targets; 
     $(this).toggleClass("icon-fold icon-expand");

    if ($(this).val() === "fold") {
      $(this).val("expand");
      $(this).attr("data-tooltiptext", "Expand all");
      targets = $(selectors.mainContainer).find(".icon-fold");

    } else {
      $(this).val("fold");
      $(this).attr("data-tooltiptext", "Fold all");
      targets = $(selectors.mainContainer).find(".icon-expand");
    }
    const parents = $(targets).parent()
    utils.toggleFold(parents)
    lazy.lazyLoad();
  });

  $(selectors.topGotoTop).on("click", function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });

  //top search button
  $(selectors.topSearchBtn).on("click", function () {
    searchHandler.cycleFound()
  });

  // top load file btn
  $(selectors.topFileInputBtn).on("change", (e) => {
    loadFile(e);
    undoHandlers.unsetUndo();
    undoHandlers.unsetRedo();
    searchHandler.resetSearch();
    gotoHandler.resetGoto();
    lazy.lazyLoad();

  });

  // top save file btn
  $(selectors.topSaveBtn).on("click", function () {
    let obj = {};
    obj = jsonHandlers.createJsonObj($(selectors.mainContainer));
    jsonHandlers.saveJson(obj);
  });

  // top open options-modal
  $(selectors.topOptionsBtn).on("click", function () {
    modalOptions.optionsModal();
  });

  // top goto to selected
  $(selectors.topGotoSelectedBtn).on("click", function () {
    gotoHandler.cycleSelected();
  });

  // top clipboard button
  $(selectors.topClipboardBtn).on("click", function () {
    modalClipboard.clipboardModal();
  });

  // delegation for all select-deselect buttons
  $(selectors.mainContainer).on("click", ".select-element", function () {
    $(this).toggleClass("icon-select-on icon-select-off");
  });

  // delegation for all add buttons
  $(selectors.mainContainer).on("click", ".add-button", function () {
    let parentOfParent = $(this).parent();
    let targetContainer;
    // if we add from array
    if ($(parentOfParent).children(".array-container").length) {
      targetContainer = $(parentOfParent).children(".array-container");
        modalAdd.toggleAddModalArrayMode(true);
    }
    else {
      // add from object
      targetContainer = $(parentOfParent).children(".obj-container");
      modalAdd.toggleAddModalArrayMode(false);
    }
    holdingContainer = targetContainer;
    modalAdd.addModal(targetContainer);
    $(parentOfParent).children(".clear-button").prop("disabled", false);
    lazy.lazyLoad();

  });

  // delegation for all delete buttons
  $(selectors.mainContainer).on("click", ".del-button", function () {
    const parent = $(this).parent();
    if (parent === selectedElement) {
      selectedElement = null;
    }
    modalRemove.removeModal(parent);
  });

  // delegation for all fold buttons
  $(selectors.mainContainer).on("click", ".hide-button", function () {
    const parentOfParent = $(this).parent();
    utils.toggleFold(parentOfParent); 
  });

  // delegation for all clear buttons
  $(selectors.mainContainer).on("click", ".clear-button", function () {
    undoHandlers.unsetRedo();
    undoHandlers.setUndo();
    let parentOfParent = $(this).parent();
    let targetContainer = $(parentOfParent).children(".obj-container, .array-container");
    $(targetContainer).empty();
    $(this).prop("disabled", true);
    if ($(targetContainer).hasClass("array-container")) {
      $(targetContainer).val("");
    }
  });

  // delegation for all copy buttons
  $(selectors.mainContainer).on("click", ".copy-button", function () {
    let sourceElement = $(this).parent();
    modalClipboard.setClipboardContent(sourceElement);
  });

  // delegation for all paste full object buttons
  $(selectors.mainContainer).on("click", ".paste-button", function () {
    let destinationParent = $(this).parent();
    modalClipboard.pasteClipboardContentsOnly(destinationParent);
  });

  // delegation for clicking on labels to change text
  $(selectors.mainContainer).on("click", "label", function (e) {
    e.preventDefault();
    const parent = $(this).parent();
    modalRename.renameModal(parent);
  });
}

function bindModals() {
  modalRemove.initRemoveModal();
  modalAdd.initAddModal();
  modalRename.initRenameModal();
  modalClipboard.initClipboardModal();
  modalOptions.initOptionsModal();
}

function disableRightClickContextMenu() {
  // disables right-click from page
  $(selectors.everything).on("contextmenu", function (e) {
    e.preventDefault();
  });
}

// makes the save json button enabled only if there is at least one field in the top container
function toggleSaveBtn(targetNode) {
  // Select the target node to observe
  // const targetNode = document.getElementById("mainContainer");
  // Create an observer instance
  const observer = new MutationObserver((mutationsList, observer) => {
    // Handle DOM changes here
    // Check if the div has no children
    if ($(selectors.mainContainer).children().length === 0) {
      $(selectors.topAddBtnObj).show("fast");
      $(selectors.topAddBtnArray).show("fast");
      $(selectors.topPasteBtn).show("fast");
      $(selectors.topSaveBtn).prop("disabled", true);
    } else {
      if ($(selectors.mainContainer).children().children("label").length === 0) {
        //array of objects
        $(selectors.topAddBtnObj).hide("fast");
        $(selectors.topAddBtnArray).hide("fast");
        $(selectors.topPasteBtn).hide("fast");
      } else {
        // object
        $(selectors.topAddBtnObj).show("fast");
        $(selectors.topAddBtnArray).hide("fast");
        $(selectors.topPasteBtn).show("fast");
      }
      $(selectors.topSaveBtn).prop("disabled", false);
    }
  });
  // Start observing the target node for DOM changes
  observer.observe(targetNode, { childList: true, subtree: true });
}

// TODO: MOVE AWAY

function loadFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  const filename = file.name;
  const filetype = jsonHandlers.getFileType(filename);

  reader.onload = (e) => {
    const contents = e.target.result;
    try {
      // set collapse all btn, holding container
      prepareFields(file);
      let jsonContent = {};
      //sets the content depending on file type
      if (filetype === "json") {
        jsonContent = JSON.parse(contents);
      } else if (filetype === "xls" || filetype === "xlsx" || filetype === "csv") {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          jsonContent[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });
      }
      // if contents are array
      if (Array.isArray(jsonContent)) {
        createField.createArrayField("", holdingContainer);
        holdingContainer = $(holdingContainer).find(".array-container")[0];
      }
      // display contents
      jsonHandlers.printLoadedJson(jsonContent, holdingContainer);
    } catch (error) {
      alert("Not a valid .json or spreadsheet file");
      $(selectors.fileNameInput).val("");
    }
  };
  // define reader behavior
  if (filetype === "json") {
    reader.readAsText(file);
  } else if (filetype === "xls" || filetype === "xlsx" || filetype === "csv") {
    reader.readAsArrayBuffer(file);
  }
  // clears the file input
  $(selectors.topFileInputBtn).val("");

  // prepares the fields when loading a file
  function prepareFields(file) {
    $(selectors.mainContainer).empty(); // remove contents of main
    $(selectors.fileNameInput).val(file.name); // set filename to field
    $(selectors.topFoldUnfoldBtn).val("hide"); // set collapse-all btn
    $(selectors.topFoldUnfoldBtn).removeClass("icon-fold");
    $(selectors.topFoldUnfoldBtn).addClass("icon-expand");
    holdingContainer = $(selectors.mainContainer); // set holdingcontainer
  }
}
