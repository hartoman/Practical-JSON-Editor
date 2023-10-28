const selectors = {
    fileInput: '#jsonFileInput',
    container:'#container'
}

let originalJson;

$(selectors.fileInput).on('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      // Parse the JSON data
     //   const jsonContent = JSON.parse(contents);
        processWorkingJson(contents);
     // Use the JSON data as required
    //    printFields(jsonContent,$(selectors.container));
    };

    reader.readAsText(file);
});


function processWorkingJson(inputJson) {
    originalJson = inputJson;
    const jsonContent = JSON.parse(originalJson);
    printFields(jsonContent,$(selectors.container));
}

function printFields(json,parentContainer) {
    
    for (let key in json) {
        if (Array.isArray(json[key]) || typeof(json[key])==='object' && json[key]!=null) {
            createArrayContainer(key, parentContainer);
            let arrayContainer = $(parentContainer).find(`#${key}`)
            printFields(json[key], arrayContainer); // Recursively call the function for nested objects
            
      } else {
          console.log(`${key}: ${json[key]}`); // Print the field
          createUiField(key,json[key],parentContainer) 
      }
    }
}
 

function createArrayContainer(title,parentContainer) {
    let arrayContainer = document.createElement('div')
    $(arrayContainer).attr("id",title)
    $(arrayContainer).addClass('container border border-2');
    let fieldlabel = document.createElement('label')
    $(fieldlabel).addClass('col-2 h6');
    $(fieldlabel).prop("textContent",title)
    let singleLine = document.createElement('hr')
    arrayContainer.appendChild(fieldlabel);
    arrayContainer.appendChild(singleLine);
    $(arrayContainer).appendTo(parentContainer);
}


function createUiField(key,value,parentContainer) {
    let fieldDiv = document.createElement('div')
    $(fieldDiv).addClass('row container border-2');
    let deletebutton=document.createElement('button')
    $(deletebutton).addClass('col-1');
    let fieldlabel = document.createElement('label')
    $(fieldlabel).addClass('col-2');
    let fieldinput = document.createElement('input')
    $(fieldinput).addClass('col-4');
    fieldlabel.textContent = key;
    fieldinput.type = 'text';
    fieldinput.name = value;
    $(fieldinput).val(value);
    fieldDiv.appendChild(deletebutton);
    fieldDiv.appendChild(fieldlabel);
    fieldDiv.appendChild(fieldinput);
    $(fieldDiv).appendTo(parentContainer);
}