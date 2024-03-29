/*
Copyright © 2024 Christos Chartomatsidis. 

This file is part of Practical JSON Editor.

"Practical JSON Editor" is free software: you can redistribute it and/or modify
it under the terms of the Creative Commons Attribution-ShareAlike 4.0 International License.

You should have received a copy of the Creative Commons Attribution-ShareAlike 4.0 International License
along with this program. If not, see <https://creativecommons.org/licenses/by-sa/4.0/>.

This software is provided on an "as-is" basis, meaning without any warranties or guarantees of any kind. 

You must give appropriate credit , provide a link to the license, and indicate if changes were made . You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
*/
import * as utils from "../functions/utils.js";
import * as allInArray from "../functions/modifyAllInArray.js";
import * as undoHandlers from "../functions/undoHandlers.js";

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
      $('body').css('overflow', 'hidden');
    },
    beforeClose: function (event, ui) {
      $('body').css('overflow', 'auto');
    },
    buttons: [
      {
        text: "Remove",
        class: "btn-solid",
        click: function () {
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
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
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
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
