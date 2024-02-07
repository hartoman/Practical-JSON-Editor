import * as utils from "../functions/utils.js";
import * as jsonHandlers from "../functions/jsonHandlers.js";

let clipboardContent = null;
let isAlreadyPrinted = false;

export const initClipboardModal = () => {
    $("#clipboardModal").dialog({
      autoOpen: false,
      title: "Clipboard",
      modal: true,
      draggable: false,
      resizable: false,
      parent: {},
      open: function () {
        $(".ui-widget-overlay").css({ opacity: ".7" });
      },
      buttons: [
        {
          text: "Clear Clipboard",
          class: "btn-solid",
          click: function () {
            unsetClipboardContent();
          },
        },
        {
          text: "Close",
          class: "btn-solid",
          click: function () {
            $(this).dialog("close");
          },
        },
      ],
    });
  };
  
export const clipboardModal = () => {
//  const jsonString = JSON.stringify(copiedtext, null, 2);
  printClipboardContent();
    $("#clipboardModal").dialog("open");
};
  
export const setClipboardContent = (sourceElement) => {
  clipboardContent = $(sourceElement).clone(true);
  isAlreadyPrinted = false;
};

 const unsetClipboardContent = (sourceElement) => {
   clipboardContent = null;
   isAlreadyPrinted = false;
   printClipboardContent()
};
  
export const pasteClipboardContent = (destinationParent) => {
  let destination = $(destinationParent).children(".obj-container, .array-container").first();

  if (clipboardContent) {
    // deep clone of the global copied element, so that we bypass pass by reference
    let tempElement = $(clipboardContent).clone(true);

    // named objects pasted in arrays lose their label
    if ($(destinationParent).children(".array-container").length && $(tempElement).children("label").length) {
      $(tempElement).children("label").remove();
    }
    // unnamed objects pasted as fields of parent object gain a label
    else if ($(destinationParent).children(".obj-container").length && !$(tempElement).children("label").length) {
      const deletebtn = $(tempElement).children("button").first();
      deletebtn.after(
        '<label class="col-1 my-auto custom-tooltip" data-tooltiptext="Click to change field name">ENTER_NAME</label>'
      );
    }
    $(destination).append(tempElement);
  }
};
 /* 
export const printClipboardContent = () => {
  console.log(clipboardContent);
};*/
  
const printClipboardContent = () => {

  if (!isAlreadyPrinted) {
    if (clipboardContent != null) {
      let holdingContainer = $(clipboardContent).children();
      let jsonContent;
      if (utils.isArray(holdingContainer)) {
        jsonContent = jsonHandlers.fromArrayToJson(holdingContainer);
      } else {
        jsonContent = jsonHandlers.createJsonObj(holdingContainer);
      }
      let jsonStr = JSON.stringify(jsonContent, null, 2);
     // modalClipboard.clipboardModal(jsonStr);
      $('#clipboardContent').html(jsonStr)
    }
    else {
      $('#clipboardContent').html('Clipboard is empty')
    }
    isAlreadyPrinted = true;
  }




}