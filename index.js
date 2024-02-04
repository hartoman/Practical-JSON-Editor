import * as modalRemove from './js/modals/modalRemove.js';
import * as modalRename from './js/modals/modalRename.js';
import * as modalAdd from './js/modals/modalAdd.js';
import * as utils from './js/functions/utils.js';
import * as createField from './js/functions/createFieldFunctions.js'
import * as jsonHandlers from './js/functions/jsonHandlers.js';
import * as undoHandlers from './js/functions/undoHandlers.js';

const selectors = {
  everything: "*",
  addBtn: ".add-button",
  clearBtn: ".clear-button",
  clipboardBtn: "#clipboardBtn",
  deleteBtn: ".del-button",
  hideBtn: ".hide-btn",
  mainContainer: "#mainContainer",
  saveBtn: "#saveBtn",
  optionsBtn: "#optionsBtn",
  optionsModal: "#optionsModal",
  darkmodeCheckbox: "#darkmode-checkbox",
  optionModalOK: "#optionModalOK",
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
  toggleTooltipsCheckbox: "#show-tooltips-checkbox",
};

// keeps track of the div that contains the add button
let holdingContainer = $(selectors.mainContainer);
let clonedElement = null;

$(document).ready(function () {
  init();
});

function init() {
  bindButtons();
  //disableRightClickContextMenu();
  toggleSaveBtn(document.getElementById("mainContainer"));
  bindModals();
}

function bindButtons() {
  // top Add Obj button
  $("#topAddBtnObj").on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    //toggleModalArrayMode(false);
    //$(selectors.addBtnModal).show();

    modalAdd.addModal(holdingContainer);
  });

  // top Add Array button
  $("#topAddBtnArray").on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    createField.createArrayField("", holdingContainer);
  });

  // top undo button TODO:
  $("#undoBtn").on("click", function () {
      undoHandlers.undo()

  });

  // top empty clipboard button
  $(selectors.clipboardBtn).on("click", function () {
    clonedElement = null;
    toggleClipboardBtn();
  });

  // top Clear button
  $("#topClearBtn").on("click", function () {
    $(selectors.mainContainer).empty();
  });

  // top Collapse-All button
  $("#topCollapseAllBtn").on("click", function () {
    let targets = $(selectors.mainContainer).find(".hide-button");
    let icon = $(this).children(".bi");
    //alternates between two icons
    $(icon).toggleClass("bi-arrow-up-left-circle bi-arrow-down-right-circle-fill");

    if ($(this).val() === "hide") {
      $(this).val("show");
      $(this).attr("data-tooltiptext", "Unfold all");
      $(targets).map(function () {
        if ($(this).val() === "hide") {
          $(this).trigger("click");
        }
      });
    } else {
      $(this).val("hide");
      $(this).attr("data-tooltiptext", "Fold all");
      $(targets).map(function () {
        if ($(this).val() != "hide") {
          $(this).trigger("click");
        }
      });
    }
  });

  // top load file btn
  $(selectors.fileInputBtn).on("change", (e) => {
   loadFile(e) 
  });

  // top save file btn
  $(selectors.saveBtn).on("click", function () {
    let obj = {};
    obj = jsonHandlers.createJsonObj($(selectors.mainContainer));
    jsonHandlers.saveJson(obj);
  });

  // TODO: MAKE THE NEW REMOVE THE OLD
  // top open options-modal
  $(selectors.optionsBtn).on("click", function () {
    $(selectors.optionsModal).show();
  });

  // close options-modal modal btn
  $(selectors.optionModalOK).on("click", function () {
    $(selectors.optionsModal).hide();
  });

  // button that switches between dark mode and normal
  $(selectors.darkmodeCheckbox).on("change", function () {
    $("body").toggleClass("json-editor-dark");
  });

  // button that toggles tooltips
  $(selectors.toggleTooltipsCheckbox).on("change", function () {
    $("body").toggleClass("showTooltips");
  });

  // delegation for all add buttons
  $(selectors.mainContainer).on("click", ".add-button", function () {
    // TODO:
   /* lastAction = jsonHandlers.createJsonObj($(selectors.mainContainer));*/
    let parentOfParent = $(this).parent();
    let targetContainer;
    // if we add from array
    if ($(parentOfParent).children(".array-container").length) {
      targetContainer = $(parentOfParent).children(".array-container");
      holdingContainer = targetContainer;
      if (targetContainer.val() === "") {
        // if no items in the array, the value has not been set
        modalAdd.toggleAddModalArrayMode(true);
        modalAdd.addModal(targetContainer)
      } else {
        const arrayType = targetContainer.val();
        createField.createFields("", arrayType, holdingContainer);
      }
    } else {
      // add from object
      targetContainer = $(parentOfParent).children(".obj-container");
      modalAdd.toggleAddModalArrayMode(false);
      modalAdd.addModal(targetContainer)
      $(parentOfParent).children(".clear-button").prop("disabled", false);
    }
  });

  // delegation for all delete buttons
  $(selectors.mainContainer).on("click", ".del-button", function () {

    const parent = $(this).parent();
    modalRemove.removeModal(parent);
  });

  // delegation for all hide buttons
  $(selectors.mainContainer).on("click", ".hide-button", function () {
    let parentOfParent = $(this).parent();
    let targetContainer = $(parentOfParent).children(".obj-container, .array-container");
    let addbtn = $(this).parent().children(".add-button");
    let clearbtn = $(this).parent().children(".clear-button");
    let icon = $(this).children(".bi");
    //alternates between two icons
    $(icon).toggleClass("bi-arrow-up-left-circle bi-arrow-down-right-circle-fill");

    if ($(this).val() === "hide") {
      $(this).val("show");
      $(this).attr("data-tooltiptext", "Unfold contents");
      targetContainer.hide("fast");
      addbtn.hide("fast");
      clearbtn.hide("fast");
    } else {
      $(this).val("hide");
      $(this).attr("data-tooltiptext", "Fold contents");
      targetContainer.show("fast");
      addbtn.show("fast");
      clearbtn.show("fast");
    }
  });

  // delegation for all clear buttons
  $(selectors.mainContainer).on("click", ".clear-button", function () {

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
    clonedElement = $(sourceElement).clone(true);
    toggleClipboardBtn();
  });

  // delegation for all paste buttons
  $(selectors.mainContainer).on("click", ".paste-button", function () {
    let destinationParent = $(this).parent();
    let destination = $(destinationParent).children(".obj-container, .array-container").first();

    if (clonedElement) {
      // deep clone of the global copied element, so that we bypass pass by reference
      let tempElement = $(clonedElement).clone(true);

      // named objects pasted in arrays lose their label
      if ($(destinationParent).children(".array-container").length && $(tempElement).children("label").length) {
        $(tempElement).children("label").remove();
      }
      // unnamed objects pasted as fields of parent object gain a label
      else if ($(destinationParent).children(".obj-container").length && !$(tempElement).children("label").length) {
        const deletebtn = $(tempElement).children("button").first();
        deletebtn.after(
          '<label class="col-1 my-auto custom-tooltip" data-tooltiptext="Right click to change field name">ENTER_NAME</label>'
        );
      }
      $(destination).append(tempElement);
    }
  });

  // delegation for clicking on labels to change text
  $(selectors.mainContainer).on("click", "label", function (e) {
    e.preventDefault(); 
    const parent = $(this).parent();
    modalRename.renameModal(parent)
  });
}

function bindModals() {
  modalRemove.initRemoveModal();
  modalAdd.initAddModal();
  modalRename.initRenameModal()
 }

 /*
// TODO: D
function setLastAction() {
  lastAction = jsonHandlers.createJsonObj($(selectors.mainContainer));
}*/

// TODO: A changes the display of the clipboard btn
function toggleClipboardBtn() {
  let icon = $(selectors.clipboardBtn).children(".bi");
  if (clonedElement) {
    $(selectors.clipboardBtn).attr("data-tooltiptext", "Clipboard is full, click to empty");
    $(icon).toggleClass("bi-clipboard bi-clipboard-check");
  } else {
    $(selectors.clipboardBtn).attr("data-tooltiptext", "Clipboard is empty");
    $(icon).toggleClass("bi-clipboard bi-clipboard-check");
  }
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
      $("#topAddBtnObj").show("fast");
      $("#topAddBtnArray").show("fast");
      $(selectors.saveBtn).prop("disabled", true);
    } else {
      if ($(selectors.mainContainer).children().children("label").length === 0) {
        //array of objects
        $("#topAddBtnObj").hide("fast");
        $("#topAddBtnArray").removeClass("d-flex");
        $("#topAddBtnArray").hide("fast");
        $;
      } else {
        // object
        $("#topAddBtnObj").show("fast");
        $("#topAddBtnArray").hide("fast");
      }
      $(selectors.saveBtn).prop("disabled", false);
    }
  });
  // Start observing the target node for DOM changes
  observer.observe(targetNode, { childList: true, subtree: true });
}

function loadFile(e) {
 // lastAction = {};

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
        holdingContainer = $(holdingContainer).find(".array-container");
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
  $(selectors.fileInputBtn).val("");

  // prepares the fields when loading a file
  function prepareFields(file) {
    $(selectors.mainContainer).empty(); // remove contents of main
    $(selectors.fileNameInput).val(file.name); // set filename to field
    $("#topCollapseAllBtn").val("hide"); // set collapse-all btn
    let icon = $("#topCollapseAllBtn").children(".bi");
    //  $(icon).toggleClass('bi-arrow-up-left-circle bi-arrow-down-right-circle-fill');
    $(icon).removeClass("bi-arrow-down-right-circle-fill");
    $(icon).addClass("bi-arrow-up-left-circle");
    holdingContainer = $(selectors.mainContainer); // set holdingcontainer
  }
}