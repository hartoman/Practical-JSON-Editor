import * as utils from "../functions/utils.js";
import * as jsonHandlers from "../functions/jsonHandlers.js";

const selectors = {
  topClipboardBtn: "#clipboardBtn",
}

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
        $('body').css('overflow', 'hidden');
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
            $('body').css('overflow', 'auto');  //TODO: SET THIS IN ALL MODALS
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
  toggleClipboardBtn()
};

export const getClipboardContent = () => {
  return clipboardContent;
};

 const unsetClipboardContent = (sourceElement) => {
   clipboardContent = null;
   isAlreadyPrinted = false;
   printClipboardContent()
   toggleClipboardBtn()
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
    // TODO change the generated label destination
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

// changes the display of the clipboard btn 
function toggleClipboardBtn() {
  if (getClipboardContent()) {
    $(selectors.topClipboardBtn).attr("data-tooltiptext", "Clipboard is full, click to empty");
  } else {
    $(selectors.topClipboardBtn).attr("data-tooltiptext", "Clipboard is empty");
  }
}