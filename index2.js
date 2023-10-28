const selectors2 = {
  mainAddbtn: "#mainAddBtn",
  mainContainer: "#mainContainer",
  addBtnModal: "#addBtnModal",
  saveBtn: "#saveBtn",
  modalXBtn: "#addBtnModal .close",
  modalCloseBtn: "#addBtnModal .btn-secondary",
  modalCreateBtn: "#addBtnModal .btn-primary",
  modalNameInput: "#modalNameInput",
  modalSelection: "#modalSelection",
};

// keeps track of the div that contains the add button
let holdingContainer;

$(document).ready(function () {
  init();
});

function init() {
  bindButtons();
}

function bindButtons() {
  // top-most add button
  $(selectors2.mainAddbtn).on("click", function () {
    addBtnClicked(this);
  });

  // toggles the save button to enabled if there is at least one field
  toggleSaveBtn();

  // when save button is clicked
  $(selectors2.saveBtn).on("click", function () {
    let obj = {};
    obj = createJsonObj();
    console.log(obj);
    dataObjToJson(obj);
  });

  // modal close buttons
  $(selectors2.modalXBtn)
    .add(selectors2.modalCloseBtn)
    .on("click", function () {
      $(selectors2.addBtnModal).hide();
    });

  // modal toggle enabled create btn
  $(selectors2.modalNameInput).on("input", function () {
    if ($(selectors2.modalNameInput).val() == "") {
      $(selectors2.modalCreateBtn).prop("disabled", true);
    } else {
      $(selectors2.modalCreateBtn).prop("disabled", false);
    }
  });

  // modal create btn
  $(selectors2.modalCreateBtn).on("click", function () {
    let fieldName = $(selectors2.modalNameInput).val();
    let selectedOption = $(selectors2.modalSelection).find(":selected").val();
    createFromModal(fieldName, selectedOption);
    $(selectors2.addBtnModal).hide();
    $(selectors2.modalNameInput).val("");
  });
}

// makes the save json button enabled only if there is at least one field in the top container
function toggleSaveBtn() {
  // Select the target node to observe
  const targetNode = document.getElementById("mainContainer");
  // Create an observer instance
  const observer = new MutationObserver((mutationsList, observer) => {
    // Handle DOM changes here
    // Check if the div has no children
    if ($(selectors2.mainContainer).children().length === 0) {
      $(selectors2.saveBtn).prop("disabled", true);
    } else {
      $(selectors2.saveBtn).prop("disabled", false);
    }
  });
  // Start observing the target node for DOM changes
  observer.observe(targetNode, { childList: true, subtree: true });
}

// sets parentDivOfAddBtn to be a sibling container to the add button (same parent)
function addBtnClicked(btn) {
  $(selectors2.addBtnModal).show();
  immediatParent = btn.parentNode;
  parentDivOfAddBtn = immediatParent.parentNode;
  holdingContainer = $(parentDivOfAddBtn).children(".container");
}

// creates a field depending on type selection
function createFromModal(fieldName, selectedOption) {
  switch (selectedOption) {
    case "text": {
    }
    case "number": {
    }
    case "boolean": {
      createSimpleField(fieldName, selectedOption, holdingContainer);
      break;
    }
    case "object": {
      createObjectField(fieldName);
      break;
    }
    case "array": {
      createArrayField(fieldName);
      break;
    }
  }
}

function deleteField(e) {
  let currentField = e.target.parentNode;
  currentField.remove();
}

function createSimpleField(fieldName, type, parentContainer) {
  // field container
  let fieldDiv = document.createElement("div");
  $(fieldDiv).addClass("row container border-2");
  // delete button
  let deletebutton = document.createElement("button");
  $(deletebutton).text("delete");
  $(deletebutton).addClass("col-2");
  // label
  let fieldlabel = document.createElement("label");
  $(fieldlabel).addClass("col-2");
  $(fieldlabel).text(fieldName);
  // input
  let fieldinput = document.createElement("input");
  $(fieldinput).addClass("col-4");
  // refine input
  switch (type) {
    case "text": {
      fieldinput.type = "text";
      break;
    }
    case "number": {
      fieldinput.type = "number";
      break;
    }
    case "boolean": {
      fieldinput.type = "checkbox";
      break;
    }
  }

  // append in field container and then to parent container
  $(fieldDiv).append(deletebutton);
  $(fieldDiv).append(fieldlabel);
  $(fieldDiv).append(fieldinput);
  $(fieldDiv).appendTo(parentContainer);

  // bind deletebutton
  $(deletebutton).on("click", function (e) {
    deleteField(e);
  });
}

function createArrayField(fieldName) {
  console.log("array: " + fieldName);
}

function createObjectField(fieldName) {
  console.log("obj: " + fieldName);
}

function saveJson() {}

function createJsonObj() {
  // creates lists that refer to labels and the corresponding inputs
  // the lists must ALWAYS have the same length!!!
  const labels = $(selectors2.mainContainer).find("label");
  const inputs = $(selectors2.mainContainer).find("input");
  // creates empty json obj
  const data = {};
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
    if (inputs[i].type === "text" || inputs[i].type === "number") {
      value = $(inputs[i]).val();
    }
    // adds field to the json object
    data[key] = value;
  }
  return data;
}

// creates json from object and downloads it
function dataObjToJson(obj) {
  const data = JSON.stringify(obj, null, 2); // Converts the object to a formatted JSON string
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "nyhas.json";
  link.click();

  URL.revokeObjectURL(url); // Release the object URL when done
}
