const selectors = {
  addBtn: ".add-button",
  clearBtn: ".clear-button",
  deleteBtn: ".del-button",
  hideBtn: ".hide-btn",
  mainContainer: "#mainContainer",
  addBtnModal: "#addBtnModal",
  saveBtn: "#saveBtn",
  modalCloseBtn: "#addBtnModal .close",
  modalCreateBtn: "#addBtnModal .btn-primary",
  modalNameTag: "#modalNameTag",
  modalNameInput: "#modalNameInput",
  modalSelection: "#modalSelection",
  arrayType: "#arrayType",
};

// keeps track of the div that contains the add button
let holdingContainer = $(selectors.mainContainer);

$(document).ready(function () {
  init();
});

function init() {
  bindButtons();
  initModal();
 // createArrayField("", $(selectors.mainContainer));
  //  createObjectField("object", $(selectors.mainContainer));
  // createTextInputField("input", "oioi", $(selectors.mainContainer));
  // createTextArea("textarea", placetext, $(selectors.mainContainer));
  // createNumberInputField("number", 3.14, $(selectors.mainContainer));
  // createArrayField("array", $(selectors.mainContainer));
}

function bindButtons() {
  // top Add Obj button
  $("#topAddBtnObj").on("click", function () {
    holdingContainer = $(selectors.mainContainer);
    toggleModalArrayMode(false);
    $(selectors.addBtnModal).show();
    $("#topClearBtn").prop("disabled", false);
  });

    // top Add Obj button
    $("#topAddBtnArray").on("click", function () {
      holdingContainer = $(selectors.mainContainer);
      toggleModalArrayMode(true);
      $(selectors.addBtnModal).show();
      $("#topClearBtn").prop("disabled", false);
    });

  // top Clear button
  $("#topClearBtn").on("click", function () {
    $(selectors.mainContainer).empty();
    $(this).prop("disabled", true);
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
      if ($(selectors.mainContainer).children().length === 0) {
        $("#topClearBtn").prop("disabled", true);
      }
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
      $(icon).removeClass("bi-arrow-up-left-circle");
      $(icon).addClass("bi-arrow-down-right-circle-fill");
      addbtn.hide();
      clearbtn.hide();
      targetContainer.hide();
    } else {
      $(this).val("hide");
      $(icon).removeClass("bi-arrow-down-right-circle-fill");
      $(icon).addClass("bi-arrow-up-left-circle");
      addbtn.show();
      clearbtn.show();
      targetContainer.show();
    }
  });

  // delegation for all clear buttons
  $(selectors.mainContainer).on("click", ".clear-button", function () {
    if (confirm("Delete all contents of selected field?")) {
      let parentOfParent = $(this).parent();
      let targetContainer = $(parentOfParent).children(".obj-container, .array-container");
      $(targetContainer).empty();
      $(this).prop("disabled", true);
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
      $(selectors.modalCreateBtn).prop("disabled", true);
    } else {
      $(selectors.modalCreateBtn).prop("disabled", false);
    }
  });

  // modal create btn
  $(selectors.modalCreateBtn).on("click", function () {
    let fieldName = $(selectors.modalNameInput).val();
    let selectedOption = $(selectors.modalSelection).find(":selected").val();

    if (isArray(holdingContainer)) {
      $(holdingContainer).parent().children(".array-container").val(selectedOption);
      fieldName = "";
      //  toggleModalArrayMode(false);
    }
    createFields(fieldName, selectedOption, holdingContainer);
    $(selectors.addBtnModal).hide();
    $(selectors.modalNameInput).val("");
  });
}

function toggleModalArrayMode(isForArrayField) {
  if (isForArrayField) {
    $(selectors.addBtnModal).find(".modal-title").text("Set Array Type");
    $(selectors.modalNameTag).hide();
    $(selectors.modalNameInput).hide();
    $(selectors.modalCreateBtn).prop("disabled", false);
  } else {
    $(selectors.addBtnModal).find(".modal-title").text("Add Json Field");
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
      createBooleanField("boolean", false, holdingContainer);
      break;
    case "array":
      createArrayField("array", holdingContainer);
      break;
  }
}

function initModal() {
  toggleSaveBtn(document.getElementById("mainContainer"));

  // makes the save json button enabled only if there is at least one field in the top container
  function toggleSaveBtn(targetNode) {
    // Select the target node to observe
    // const targetNode = document.getElementById("mainContainer");
    // Create an observer instance
    const observer = new MutationObserver((mutationsList, observer) => {
      // Handle DOM changes here
      // Check if the div has no children
      if ($(selectors.mainContainer).children().length === 0) {
        $(selectors.saveBtn).prop("disabled", true);
      } else {
        $(selectors.saveBtn).prop("disabled", false);
      }
    });
    // Start observing the target node for DOM changes
    observer.observe(targetNode, { childList: true, subtree: true });
  }
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

function createBooleanField(fieldKey, fieldValue = false, parentContainer) {
  let fieldinput = document.createElement("div");
  // Get the template element
  let templateElement = $("#boolean-template").html();
  let elementValues = {
    key: fieldKey,
    value: fieldValue,
  };
  $(parentContainer).append(Mustache.render(templateElement, elementValues));
  return fieldinput;
}

function createJsonObj(holdingContainer) {
  // creates lists that refer to labels and the corresponding inputs
  // the lists must ALWAYS have the same length!!!

  const labels = $(holdingContainer).children().children("label");
  const inputs = $(holdingContainer).children().children("input,textarea,.obj-container, .array-container");

  console.log(labels.length + " " + inputs.length);
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
      value = fillValuesFromArray(inputs[i]);
    }
    // TODO: for arrays
    // adds field to the json object
    data[key] = value;
  }
  // TODO: IF THERE IS AN ARRAY OF OBJECTS WITH NO LABEL
  if (labels.length===0&& inputs.length>0) {
    for (let i = 0; i < inputs.length; i++){
      holdingContainer = inputs[i];
      value = fillValuesFromArray(inputs[i]);
      data = value;
    }
  }
  return data;
}

function fillValuesFromArray(arrayContainer) {
  const returnedArray = [];
  const inputs = $(holdingContainer).children().children("input,textarea,.obj-container, .array-container");

  for (let i = 0; i < inputs.length; i++) {
    let value;
    if (inputs[i].classList.contains("array-container")) {
      value = fillValuesFromArray(inputs[i]);
    } else if (inputs[i].classList.contains("obj-container")) {
      value = createJsonObj(inputs[i]);
    } else if (inputs[i].type === "checkbox") {
      // for boolean fields
      if (inputs[i].checked) {
        value = true;
      } else {
        value = false;
      }
    } else {
      value = $(inputs[i]).val();
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
  link.download = "nyhas.json";
  link.click();
  URL.revokeObjectURL(url); // Release the object URL when done
}
