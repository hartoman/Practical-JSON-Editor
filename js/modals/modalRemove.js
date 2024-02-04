import * as utils from "../functions/utils.js";
import * as allInArray from "../functions/modifyAllInArray.js";

export const initRemoveModal = () => {
  $("#removeModal").dialog({
    autoOpen: false,
    title: "Remove field",
    modal: true,
    draggable: false,
    resizable: false,
    parent: {},
    open: function () {
      $(".ui-widget-overlay").css({ opacity: ".7" });
    },
    buttons: [
      {
        text: "Remove",
        class: "btn-solid",
        click: function () {
          const targetContainer = $("#removeModal").dialog("option", "parent");
          targetContainer.remove();
          $(this).dialog("close");
        },
      },
      {
        text: "Remove All",
        id: "removeAll",
        class: "btn-solid",
        style: "display: none;",
        click: function () {
          const targetContainer = $("#removeModal").dialog("option", "parent");
          const parentContainer = $(targetContainer).parents()[2];
          const fieldName = $(targetContainer).children("label").text();
          allInArray.removeFromAllObjectsInArray(parentContainer, fieldName);
          $(this).dialog("close");
        },
      },
      {
        text: "Cancel",
        class: "btn-solid",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });
};

export const removeModal = (parent) => {
  $("#removeModal").dialog("option", "parent", parent);
  const parentContainer = $(parent).parents()[2];

  if (utils.isArray(parentContainer)) {
    $("#removeAll").css("display", "block");
  } else {
    $("#removeAll").css("display", "none");
  }

  const fieldName = $(parent).children("label").text();
  $("#removeModal").html(`Remove field <strong>'${fieldName}' </strong>?`);
  $("#removeModal").dialog("open");
};
