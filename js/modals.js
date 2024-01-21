import * as utils from './utils.js';

export const removeModal = () => {
  $("#removeModal").dialog({
    autoOpen: false,
    title: "Dialog Title",
    modal: true,
    draggable: false,
    resizable: false,
    parent: {},
    buttons: [
      {
        text: "Remove",
        click: function () {
          const targetContainer = $("#removeModal").dialog("option", "parent")
          targetContainer.remove();
          $(this).dialog("close");
        },
      },
      {
        text: "Remove all",
        id: "removeAll",
        style: "display: none;",
        click: function () {
          const targetContainer = $("#removeModal").dialog("option", "parent");
          const parentContainer = $(targetContainer).parents()[2];
          const fieldName = $(targetContainer).children("label").text();
          utils.removeFromAllObjectsInArray(parentContainer, fieldName);
          $(this).dialog("close");
        },
      },
      {
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });

};


export const confRemoveModal = (parent) => { 

  $("#removeModal").dialog("option", "parent", parent);  
  const parentContainer = $(parent).parents()[2];

  if (utils.isArray(parentContainer)) { 
    $("#removeAll").css("display", "block");
  } else if (!utils.isArray(parentContainer)) {
    $("#removeAll").css("display", "none");
  }
}