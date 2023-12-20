const selectors = {
  addBtn: ".add-button",
  clearBtn: ".clear-button",
  deleteBtn: ".del-button",
  hideBtn: ".hide-btn",
  mainContainer: "#mainContainer",
  addBtnModal: "#addBtnModal",
  saveBtn: "#saveBtn",
  modalCloseBtn: "#addBtnModal .close",
  modalCreateBtn: "#addBtnModal #modalOK",
  modalNameTag: "#modalNameTag",
  modalNameInput: "#modalNameInput",
  modalDuplicateNameWarning: ".duplicate-warning-label",
  modalSelection: "#modalSelection",
  arrayType: "#arrayType",
  optionsBtn: "#optionsBtn",
  optionsModal: "#optionsModal",
  darkmodeCheckbox: "#darkmode-checkbox",
  optionModalOK: "#optionModalOK",
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
  toggleTooltipsCheckbox:"#show-tooltips-checkbox"
};

// keeps track of the div that contains the add button
let holdingContainer = $(selectors.mainContainer);
let tooltipsHidden = true;

$(document).ready(function () {
  init();
});

function init() {
  bindButtons();
  initModal();
}

function bindButtons() {
  // top Add Obj button
  $("#topAddBtnObj").on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    toggleModalArrayMode(false);
    $(selectors.addBtnModal).show();
  });

  // top Add Array button
  $("#topAddBtnArray").on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    createArrayField("", holdingContainer);
  });

  // top Clear button
  $("#topClearBtn").on("click", function () {
    $(selectors.mainContainer).empty();
    // $(this).prop("disabled", true);
  });

  // top Collapse-All button
  $("#topCollapseAllBtn").on("click", function () {
    let targets = $(selectors.mainContainer).find(".hide-button");
    let icon = $(this).children(".bi");

    if ($(this).val() === "hide") {
      $(this).val("show");
      $(icon).removeClass("bi-arrow-up-left-circle");
      $(icon).addClass("bi-arrow-down-right-circle-fill");
      $(this).attr("data-tooltiptext","Unfold all");
      $(targets).map(function () {
        if ($(this).val() === "hide") {
          $(this).trigger("click");
        }
      });
    } else {
      $(this).val("hide");
      $(icon).removeClass("bi-arrow-down-right-circle-fill");
      $(icon).addClass("bi-arrow-up-left-circle");
      $(this).attr("data-tooltiptext","Fold all");
      $(targets).map(function () {
        if ($(this).val() != "hide") {
          $(this).trigger("click");
        }
      });
    }
  });

  // button that opens options modal
  $(selectors.optionsBtn).on("click", function () {
    $(selectors.optionsModal).show();
  });

  // button that opens options modal
  $(selectors.optionModalOK).on("click", function () {
    $(selectors.optionsModal).hide();
  });

  // button that switches between dark mode and normal
  $(selectors.darkmodeCheckbox).on("change", function () {
    if ($(selectors.darkmodeCheckbox).prop("checked")) {
      $("body").addClass("json-editor-dark");
    } else {
      $("body").removeClass("json-editor-dark");
    }
  });

    // button that toggles tooltips
    $(selectors.toggleTooltipsCheckbox).on("change", function () {
      if ($(selectors.toggleTooltipsCheckbox).prop("checked")) {
        $("body").addClass("showTooltips");
      } else {
        $("body").removeClass("showTooltips");
      }
    });

  // delegation for all add buttons
  $(selectors.mainContainer).on("click", ".add-button", function () {
    let parentOfParent = $(this).parent();
    let targetContainer;
    // if we add from array
    if ($(parentOfParent).children(".array-container").length) {
      targetContainer = $(parentOfParent).children(".array-container");
      holdingContainer = targetContainer;
      if (targetContainer.val() === "") {
        // if no items in the array, the value has not been set
        toggleModalArrayMode(true);
        $(selectors.addBtnModal).show();
        $(parentOfParent).children(".clear-button").prop("disabled", false);
      } else {
        const arrayType = targetContainer.val();
        createFields("", arrayType, holdingContainer);
      }
    } else {
      targetContainer = $(parentOfParent).children(".obj-container");
      holdingContainer = targetContainer;
      toggleModalArrayMode(false);
      $(selectors.addBtnModal).show();
      $(parentOfParent).children(".clear-button").prop("disabled", false);
    }
  });

  // delegation for all delete buttons
  $(selectors.mainContainer).on("click", ".del-button", function () {
    if (confirm("Delete field?")) {
      let parentOfParent = $(this).parent();
      parentOfParent.remove();
    }
  });

  // delegation for all hide buttons
  $(selectors.mainContainer).on("click", ".hide-button", function () {
    let parentOfParent = $(this).parent();
    let targetContainer = $(parentOfParent).children(".obj-container, .array-container");
    let addbtn = $(this).parent().children(".add-button");
    let clearbtn = $(this).parent().children(".clear-button");
    let icon = $(this).children(".bi");

    if ($(this).val() === "hide") {
      $(this).val("show");
      $(this).attr("data-tooltiptext","Unfold contents");
      $(icon).removeClass("bi-arrow-up-left-circle");
      $(icon).addClass("bi-arrow-down-right-circle-fill");
      targetContainer.hide("fast");
      addbtn.hide("fast");
      clearbtn.hide("fast");
    } else {
      $(this).val("hide");
      $(this).attr("data-tooltiptext","Fold contents");
      $(icon).removeClass("bi-arrow-down-right-circle-fill");
      $(icon).addClass("bi-arrow-up-left-circle");
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
      if ($(targetContainer).hasClass('array-container')){
        $(targetContainer).val("")
      }
    }
  });

  // delegation for right clicking on labels to change text
  $(selectors.mainContainer).on("contextmenu", "label", function (e) {
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
    let hasDuplicateName = (labelExists(newLabel) && newLabel != oldLabel)?true: false;

    if (!hasDuplicateName) {
      $(this).text(newLabel);
    } else {
      alert("A field with this name already exists");
    }
  });

  // when save button is clicked
  $(selectors.saveBtn).on("click", function () {
    let obj = {};
    obj = createJsonObj($(selectors.mainContainer));
    saveJson(obj);
  });

  // modal close buttons
  $(selectors.modalCloseBtn).on("click", function () {
    $(selectors.addBtnModal).hide();
  });

  // modal toggle enabled create btn
  $(selectors.modalNameInput).on("input", function () {
    if ($(selectors.modalNameInput).val() == "") {
      // empty
      $(selectors.modalCreateBtn).prop("disabled", true);
      $(selectors.modalDuplicateNameWarning).css("visibility", "hidden");
    } else {
      if (labelExists($(selectors.modalNameInput).val())) {
        // duplicates found
        $(selectors.modalCreateBtn).prop("disabled", true);
        $(selectors.modalDuplicateNameWarning).css("visibility", "visible");
      } else {
        // not empty and no duplicates
        $(selectors.modalDuplicateNameWarning).css("visibility", "hidden");
        $(selectors.modalCreateBtn).prop("disabled", false);
      }
    }
  });

  // modal create btn
  $(selectors.modalCreateBtn).on("click", function () {
    let fieldName = $(selectors.modalNameInput).val();
    let selectedOption = $(selectors.modalSelection).find(":selected").val();

    if (isArray(holdingContainer)) {
      $(holdingContainer).parent().children(".array-container").val(selectedOption);
      fieldName = "";
    }
    createFields(fieldName, selectedOption, holdingContainer);
    $(selectors.addBtnModal).hide();
    $(selectors.modalNameInput).val("");
  });

  // load file btn
  $(selectors.fileInputBtn).on("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const filename = file.name;
    const filetype = getFileType(filename);

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
          createArrayField("", holdingContainer);
          holdingContainer = $(holdingContainer).find(".array-container");
        }
        // display contents
        printLoadedJson(jsonContent, holdingContainer);
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
    $(selectors.fileInputBtn).val("")
  });

  function prepareFields(file) {
    // TODO: WARN
    $(selectors.mainContainer).empty(); // remove contents of main
    $(selectors.fileNameInput).val(file.name); // set filename to field
    $("#topCollapseAllBtn").val("hide"); // set collapse-all btn
    let icon = $("#topCollapseAllBtn").children(".bi");
    $(icon).removeClass("bi-arrow-down-right-circle-fill");
    $(icon).addClass("bi-arrow-up-left-circle");
    holdingContainer = $(selectors.mainContainer); // set holdingcontainer
  }
}

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

function toggleModalArrayMode(isForArrayField) {
  if (isForArrayField) {
    $(selectors.addBtnModal).find(".modal-title").text("Set Array Type");
    $(selectors.modalNameTag).hide();
    $(selectors.modalNameInput).hide();
    $(selectors.modalCreateBtn).prop("disabled", false);
  } else {
    $(selectors.addBtnModal).find(".modal-title").text("Add Object Field");
    $(selectors.modalNameTag).show();
    $(selectors.modalNameInput).show();
    $(selectors.modalCreateBtn).prop("disabled", true);
  }
}

function isArray(inputContainer) {
  return inputContainer.parent().children(".array-container").length;
}

function createFields(fieldName, selectedOption, holdingContainer) {
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

function initModal() {
  toggleSaveBtn(document.getElementById("mainContainer"));
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
}

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
}

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
}

// creates json object from the input fields
function createJsonObj(holdingContainer) {
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
    if (inputs[i].type === "text" || inputs[i].type === "textarea") {
      value = $(inputs[i]).val();
    }
    if (inputs[i].type === "number") {
      value = Number($(inputs[i]).val());
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
}

// transforms unlabeled fields from an array to json fields
function fromArrayToJson(arrayContainer) {
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
      value = $(inputs[i]).val(); // text, textarea, number
    }
    returnedArray.push(value);
  }
  return returnedArray;
}

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

// creates fields for the loaded json file
function printLoadedJson(json, parentContainer) {
  for (let key in json) {
    /**/
    if (Array.isArray(json[key]) || (typeof json[key] === "object" && json[key] != null)) {
      if (Array.isArray(json[key])) {
        $(parentContainer).val("array")
        createArrayField(key, parentContainer);
        let arrayContainer = $(parentContainer).find(`#${key}`);
        printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
      } else {
        $(parentContainer).val("object")
        createObjectField(key, parentContainer);
        let arrayContainer = $(parentContainer).find(`#${key}`);
        printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
      }
    } else {
      //  console.log(`${key}: ${json[key]}`); // Print the field
      if (typeof json[key] === "string") {
        if (json[key].length <= 20) {
          $(parentContainer).val("text")
          createTextInputField(key, json[key], parentContainer); // small texts
        } else {
          $(parentContainer).val("textarea")
          createTextArea(key, json[key], parentContainer); // longer texts
        }
      } else if (typeof json[key] === "number") {
        $(parentContainer).val("number")
        createNumberInputField(key, json[key], parentContainer);
      }
      if (typeof json[key] === "boolean") {
        $(parentContainer).val("boolean")
        createBooleanField(key, json[key], parentContainer);
      }
    }
  }
  $("label").each(function () {
    if (!isNaN($(this).text())) {
      // Check if text is a number
      $(this).text(""); // Set text to nothing
      $(this).remove();
    }
  });
}
