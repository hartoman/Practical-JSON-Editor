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

const selectors = {
  renameModalNameTag: "#renameModalNameTag",
  renameModalNameInput: "#renameModalNameInput",
  renameModalDuplicateNameWarning: ".duplicate-warning-label",
  renameModalSelection: "#modalSelection",
};

export const initRenameModal = () => {
  $("#renameModal").dialog({
    autoOpen: false,
    title: "Rename field",
    modal: true,
    draggable: false,
    resizable: false,
    width: 400,
    parent: {},
    targetLabel: "",
    open: function () {
      $(".ui-widget-overlay").css({ opacity: ".7" });
      $('body').css('overflow', 'hidden');
    },
    beforeClose: function (event, ui) {
      $('body').css('overflow', 'auto');
    },
    buttons: [
      {
        text: "Rename",
        id: "renameOne",
        disabled: true,
        class: "btn-solid",
        click: function () {
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
          const parent = $("#renameModal").dialog("option", "parent");
          const label = $(parent).children("label");
          let newName = $(selectors.renameModalNameInput).val();
          $(label).text(newName);
          $(selectors.renameModalNameInput).val("");
          $(this).dialog("close");
        },
      },
      {
        text: "Rename All",
        id: "renameAll",
        disabled: true,
        class: "btn-solid",
        style: "display: none;",
        click: function () {
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
          const parent = $("#renameModal").dialog("option", "parent");
          const oldName = $(parent).children("label").text();
          const newName = $(selectors.renameModalNameInput).val();
          const parentContainer = $(parent).parents()[2];
          allInArray.renameAllObjectsInArray(parentContainer, oldName, newName);
          $(selectors.renameModalNameInput).val("");
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

export const renameModal = (parent) => {
  $("#renameModal").dialog("option", "parent", parent);

  const parentContainer = $(parent).parent();

  if (utils.isObjectInsideArray(parentContainer)) {
    $("#renameAll").css("display", "block");
  } else {
    $("#renameAll").css("display", "none");
  }

  const fieldName = $(parent).children("label").text();

  $("#test").html(`Rename field <strong>'${fieldName}' </strong>?`);

  $("#renameModal").dialog("open");
};

// modal toggle enabled create btn
$(selectors.renameModalNameInput).on("input", function () {
  if ($(selectors.renameModalNameInput).val() == "") {
    // empty
    $(selectors.renameModalCreateBtn).prop("disabled", true);
    $(selectors.renameModalDuplicateNameWarning).css("visibility", "hidden");
    $("#renameAll").button("disable");
    $("#renameOne").button("disable");
  } else {
    if (labelExists($(selectors.renameModalNameInput).val())) {
      // duplicates found
      $(selectors.renameModalCreateBtn).prop("disabled", true);
      $(selectors.renameModalDuplicateNameWarning).css("visibility", "visible");
      $("#renameAll").button("disable");
      $("#renameOne").button("disable");
    } else {
      // not empty and no duplicates
      $(selectors.renameModalDuplicateNameWarning).css("visibility", "hidden");
      $(selectors.renameModalCreateBtn).prop("disabled", false);
      $("#renameAll").button("enable");
      $("#renameOne").button("enable");
    }
  }
});

// check if the a label with the same name already exists in the holding container
function labelExists(newLabel) {
  const parent = $("#renameModal").dialog("option", "parent");
  const parentOfParent = $(parent).parent();
  const childLabels = $(parentOfParent).children().children("label");
  let exists = false;
  childLabels.map(function () {
    if ($(this).text() === newLabel) {
      exists = true;
    }
  });
  return exists;
}
