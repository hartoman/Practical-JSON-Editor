import * as createField from './createFieldFunctions.js'

const selectors = {
  fileInputBtn: "#jsonFileInputBtn",
  fileNameInput: "#fileNameInput",
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

export const renameAllObjectsInArray = (parentContainer, oldname, newName)=> {
  let siblingObjects = $(parentContainer).children().children(".obj-container");

  siblingObjects.map(function () {
    let preexistingLabels = $(this).children().children("label");
    let fieldwithsamename = preexistingLabels.filter(function () {
      return $(this).text() === oldname;
    });
    if (fieldwithsamename.length) {
      $(fieldwithsamename).text(newName);
    }
  });
}

export const removeFromAllObjectsInArray = (parentContainer, fieldName)=> {
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
}
  
export const addToAllObjectsInArray=(parentContainer, fieldName, selectedOption) =>{
  let siblingObjects = $(parentContainer).children().children(".obj-container");
  
    siblingObjects.map(function () {
      // choosing to create the field in all objects of array
      createField.createFields(fieldName, selectedOption, $(this));
    }); 
  
}

// creates json object from the input fields
export const createJsonObj = (holdingContainer)=> {
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
export const fromArrayToJson=(arrayContainer) =>{
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

// opens and loads a file
 /*
export const loadFile=(e, holdingContainer) => {
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
          createField.createArrayField("", holdingContainer);
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
}*/

// creates fields for the loaded json file
export const printLoadedJson= (json, parentContainer)=> {
  for (let key in json) {
    /**/
    if (Array.isArray(json[key]) || (typeof json[key] === "object" && json[key] != null)) {
      if (Array.isArray(json[key])) {
        $(parentContainer).val("array");
        createField.createArrayField(key, parentContainer);
        let arrayContainer = $(parentContainer).find(`#${key}`);
        printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
      } else {
        $(parentContainer).val("object");
        createField.createObjectField(key, parentContainer);
        let arrayContainer = $(parentContainer).find(`#${key}`);
        printLoadedJson(json[key], arrayContainer); // Recursively call the function for nested objects
      }
    } else {
      //  console.log(`${key}: ${json[key]}`); // Print the field
      if (typeof json[key] === "string") {
        if (json[key].length <= 20) {
          $(parentContainer).val("text");
          createField.createTextInputField(key, json[key], parentContainer); // small texts
        } else {
          $(parentContainer).val("textarea");
          createField.createTextArea(key, json[key], parentContainer); // longer texts
        }
      } else if (typeof json[key] === "number") {
        $(parentContainer).val("number");
        createField.createNumberInputField(key, json[key], parentContainer);
      }
      if (typeof json[key] === "boolean") {
        $(parentContainer).val("boolean");
        createField.createBooleanField(key, json[key], parentContainer);
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

// creates json from object and downloads it
export const saveJson= (obj) =>{
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
export const getFileType =(filename)=> {
  return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}
