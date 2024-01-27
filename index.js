import * as modalRemove from './js/modals/modalRemove.js';
import * as modalAdd from './js/modals/modalAdd.js';
import * as createField from './js/createFieldFunctions.js'
import * as utils from './js/utils.js';


const selectors = {
  everything: "*",
  addBtn: ".add-button",
  clearBtn: ".clear-button",
  clipboardBtn: "#clipboardBtn",
  deleteBtn: ".del-button",
  hideBtn: ".hide-btn",
  mainContainer: "#mainContainer",
  addBtnModal: "#addBtnModal",
  saveBtn: "#saveBtn",

 // addModalCloseBtn: "#addBtnModal .close",
 // addModalCreateBtn: "#addBtnModal #modalOK",

  arrayType: "#arrayType",
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
let lastAction = {};

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
    if (Object.keys(lastAction).length) {
      $(selectors.mainContainer).empty(); // remove contents of main
      holdingContainer = $(selectors.mainContainer);
      utils.printLoadedJson(lastAction, holdingContainer);
      lastAction = {};
    }
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
  $(selectors.fileInputBtn).on("change", function (e) {
    lastAction = {};
    const file = e.target.files[0];
    const reader = new FileReader();
    const filename = file.name;
    const filetype = utils.getFileType(filename);

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
        utils.printLoadedJson(jsonContent, holdingContainer);
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
  });

  // top save file btn
  $(selectors.saveBtn).on("click", function () {
    let obj = {};
    obj = utils.createJsonObj($(selectors.mainContainer));

    utils.saveJson(obj);
  });

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
    lastAction = utils.createJsonObj($(selectors.mainContainer));

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
    //    $(selectors.addBtnModal).show();
      //  $(parentOfParent).children(".clear-button").prop("disabled", false);
      } else {
        const arrayType = targetContainer.val();
        createField.createFields("", arrayType, holdingContainer);
      }
    } else {
      // add from object
      targetContainer = $(parentOfParent).children(".obj-container");
     // holdingContainer = targetContainer;
     // modalAdd.toggleAddModalArrayMode(false);
      modalAdd.toggleAddModalArrayMode(false);
      modalAdd.addModal(targetContainer)
     // $(selectors.addBtnModal).show();
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
    if (confirm("Delete all contents of selected field?")) {
      let parentOfParent = $(this).parent();
      let targetContainer = $(parentOfParent).children(".obj-container, .array-container");
      $(targetContainer).empty();
      $(this).prop("disabled", true);
      if ($(targetContainer).hasClass("array-container")) {
        $(targetContainer).val("");
      }
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

  // delegation for right clicking on labels to change text
  $(selectors.mainContainer).on("click", "label", function (e) {
    e.preventDefault(); // so that the usual context menu does not appear

    const oldLabel = $(this).text();
    let newLabel = prompt("Rename Label", oldLabel);
    while (newLabel === "") {
      // user tries to leave blank
      alert("Every label must have a name");
      newLabel = prompt("Rename Label", oldLabel);
    }
    if (newLabel === null) {
      // hits cancel
      newLabel = oldLabel;
    }

    // check all labels in the same nesting depth for duplicates
    holdingContainer = $(this).parents()[1];
    let hasDuplicateName = labelExists(newLabel) && newLabel != oldLabel ? true : false;

    if (!hasDuplicateName) {
      $(this).text(newLabel);
    } else {
      alert("A field with this name already exists");
    }
  });

  // modal close buttons
  $(selectors.addModalCloseBtn).on("click", function () {
    $(selectors.addBtnModal).hide();
  });




/*
  // modal toggle enabled create btn
  $(selectors.addModalNameInput).on("input", function () {
    if ($(selectors.addModalNameInput).val() == "") {
      // empty
      $(selectors.addModalCreateBtn).prop("disabled", true);
      $(selectors.addModalDuplicateNameWarning).css("visibility", "hidden");
    } else {
      if (labelExists($(selectors.addModalNameInput).val())) {
        // duplicates found
        $(selectors.addModalCreateBtn).prop("disabled", true);
        $(selectors.addModalDuplicateNameWarning).css("visibility", "visible");
      } else {
        // not empty and no duplicates
        $(selectors.addModalDuplicateNameWarning).css("visibility", "hidden");
        $(selectors.addModalCreateBtn).prop("disabled", false);
      }
    }
  });




  // modal create btn
  $(selectors.addModalCreateBtn).on("click", function () {
    let fieldName = $(selectors.addModalNameInput).val();
    let selectedOption = $(selectors.addModalSelection).find(":selected").val();

    // fields in arrays do not get names
    if (utils.isArray(holdingContainer)) {
      $(holdingContainer).parent().children(".array-container").val(selectedOption);
      fieldName = "";
    }
    let parentofParent = $(holdingContainer).parents()[1];
    // creating field in an object that is an array element,
    if (isObjectInsideArray(holdingContainer)) {
      // if a label with the same name already exists in some of the objects, it is removed
      utils.removeFromAllObjectsInArray(parentofParent, fieldName);
      utils.addToAllObjectsInArray(parentofParent, fieldName, selectedOption);
    } else {
      // solo object field outside of array
     // createFields(fieldName, selectedOption, holdingContainer);
    }

    $(selectors.addBtnModal).hide();
    $(selectors.addModalNameInput).val("");
  });
  
*/



}

function bindModals() {
  modalRemove.initRemoveModal();
  modalAdd.initAddModal();
 }

/*
function isObjectInsideArray(holdingContainer) {
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
*/
/*
function addToAllObjectsInArray(parentofParent, fieldName, selectedOption) {
  // options to add to all objects of that array
  if (
    confirm(
      "Create the same field in all objects of this array? Preexisting fields with the same name will be overwritten"
    )
  ) {
    let siblingObjects = $(parentofParent).children().children(".obj-container");
    siblingObjects.map(function () {
      // choosing to create the field in all objects of array
      createFields(fieldName, selectedOption, $(this));
    }); 
  } else {
    // choosing to create the field only in this object of array
    createFields(fieldName, selectedOption, holdingContainer);
  }
}

function removeFromAllObjectsInArray(parentContainer, fieldName) {
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
}*/

// TODO: D
function setLastAction() {
  lastAction = utils.createJsonObj($(selectors.mainContainer));
}

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

/*
// check if the a label with the same name already exists in the holding container
function labelExists(newLabel) {
  const childLabels = $(holdingContainer).children().children("label");
  let exists = false;
  childLabels.map(function () {
    if ($(this).text() === newLabel) {
      exists = true;
    }
  });
  return exists;
}
*/



/*
function isArray(inputContainer) {
  return $(inputContainer).parent().children(".array-container").length;
}*/

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
        $("#topAddBtnArray").hide("fast");
      }
      $(selectors.saveBtn).prop("disabled", false);
    }
  });
  // Start observing the target node for DOM changes
  observer.observe(targetNode, { childList: true, subtree: true });
}

/*
// creates json from object and downloads it
function saveJson(obj) {
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
}

// gets the filetype extenstion
function getFileType(filename) {
  return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}
*/
