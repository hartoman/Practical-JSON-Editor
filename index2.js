const selectors2 = {
  addBtn: ".add-button",
  clearBtn:".clear-button",
  mainContainer: "#mainContainer",
  addBtnModal: "#addBtnModal",
  saveBtn: "#saveBtn",
  modalCloseBtn: "#addBtnModal .close",
  modalCreateBtn: "#addBtnModal .btn-primary",
  modalNameInput: "#modalNameInput",
  modalSelection: "#modalSelection",
  arrayType: "#arrayType",
};

// keeps track of the div that contains the add button
let holdingContainer;

$(document).ready(function () {
  init();
});

function init() {
  bindButtons();
  initModal();

  // Get the template element
var templateElement = $('#template').html();
let test={ 
  name: 'fieldname'
}

$(selectors2.mainContainer).append(Mustache.render(templateElement,test))

}

function bindButtons() {
  // add fields button
  $(selectors2.addBtn).on("click", function () {
    $(selectors2.addBtnModal).show();
    setTargetContainer(this);
  });

  // when save button is clicked
  $(selectors2.saveBtn).on("click", function () {
    let obj = {};
    obj = createJsonObj();

    saveJson(obj);
  });

  // modal close buttons
  $(selectors2.modalCloseBtn).on("click", function () {
    $(selectors2.addBtnModal).hide();
  });

  // arrayType row appears when Array option is selected
  $(selectors2.modalSelection).on("change", function () {
    if ($(selectors2.modalSelection).find(":selected").val() === "array") {
      $(selectors2.arrayType).show();
    } else {
      $(selectors2.arrayType).hide();
    }
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
    createField(fieldName, selectedOption,holdingContainer);
    $(selectors2.addBtnModal).hide();
    $(selectors2.modalNameInput).val("");
  });
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
      if ($(selectors2.mainContainer).children().length === 0) {
        $(selectors2.saveBtn).prop("disabled", true);
      } else {
        $(selectors2.saveBtn).prop("disabled", false);
      }
    });
    // Start observing the target node for DOM changes
    observer.observe(targetNode, { childList: true, subtree: true });
  }
}

// sets parentDivOfAddBtn to be a sibling container to the add button (same parent)
function setTargetContainer(btn) {
  immediatParent = btn.parentNode;
  parentDivOfAddBtn = immediatParent.parentNode;
  holdingContainer = $(parentDivOfAddBtn).children(".container");
}

function deleteField(e) {
  let currentField = e.target.parentNode;
  currentField.remove();
}

function createField(fieldName, type, parentContainer) {
  // field container
  let fieldDiv = createContainer();
  // delete button
  let deletebutton = createDeleteBtn();
  // label
  let fieldlabel = createLabel();
  // input
  let fieldinput = defineFieldInput(type); 

  // append in field container and then to parent container
  $(fieldDiv).append(deletebutton);
  $(fieldDiv).append(fieldlabel);
  $(fieldDiv).append(fieldinput);
  $(fieldDiv).appendTo(parentContainer);

  // bind deletebutton
  $(deletebutton).on("click", function (e) {
    deleteField(e);
  });


  function createContainer() {
    let fieldDiv = document.createElement("div");
    $(fieldDiv).addClass("row container border-2");
    return fieldDiv;
  }

  function createDeleteBtn() {
    let deletebutton = document.createElement("button");
    $(deletebutton).text("delete");
    $(deletebutton).addClass("col-2");
    return deletebutton;
  }

  function createLabel() {
    let fieldlabel = document.createElement("label");
    $(fieldlabel).addClass("col-2");
    $(fieldlabel).text(fieldName);
    return fieldlabel;
  }

  function defineFieldInput(type) {
    let fieldinput;
    switch (type) {
      case "object": {
        fieldinput = createObjectField();
        break;
      }
      case "array": {
        fieldinput = createArrayField();
        break;
      }
        default: {                  // default: text, textfield, number, boolean
          fieldinput = createSimpleField(type)
        break;
      }
    }
    return fieldinput;
  }

  function createSimpleField(type) {
    let fieldinput;
    if (type === "textarea") {
      fieldinput = document.createElement("textarea");
      $(fieldinput).addClass("col-8");
    } else {
      fieldinput = document.createElement("input");
      $(fieldinput).addClass("col-2");
    }
  
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
    return fieldinput;
  }

  function createArrayField() {
    let fieldinput=document.createElement('div')
    return fieldinput;
  }
  
  function createObjectField() {
    let fieldinput = document.createElement('div')
    
      // Get the template element
var templateElement = $('#template').html();
let test={ 
  name: 'testfield'
}

    $(selectors2.mainContainer).append(Mustache.render(templateElement, test))
    
    return fieldinput;
  }

}

function createJsonObj() {
  // creates lists that refer to labels and the corresponding inputs
  // the lists must ALWAYS have the same length!!!
  const labels = $(selectors2.mainContainer).find("label");
  const inputs = $(selectors2.mainContainer).find("input,textarea");
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
    if (inputs[i].type === "text" || inputs[i].type === "number" || inputs[i].type === "textarea") {
      value = $(inputs[i]).val();
    }
    // adds field to the json object
    data[key] = value;
  }
  return data;
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
