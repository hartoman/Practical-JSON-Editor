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
import * as undoHandlers from "../functions/undoHandlers.js";
import * as createField from "../functions/createFieldFunctions.js";
import * as allInArray from "../functions/modifyAllInArray.js";
import * as lazy from "../functions/lazyLoadHandler.js";

const selectors = {
  addModalNameTag: "#addModalNameTag",
  addModalNameInput: "#addModalNameInput",
  addModalDuplicateNameWarning: "#addModal .duplicate-warning-label",
  addModalSelection: "#modalSelection",
};

/** add field modal */
export const initAddModal = () => {
  $("#addModal").dialog({
    autoOpen: false,
    title: "Add field",
    modal: true,
    draggable: false,
    resizable: false,
    width: 400,
    parent: {},
    indexNumber:null,
    open: function () {
      $(".ui-widget-overlay").css({ opacity: ".7" });
      $("body").css("overflow", "hidden");
    },
    beforeClose: function (event, ui) {
      $("body").css("overflow", "auto");
    },
    buttons: [
      {
        text: "Add",
        id: "addOne",
        disabled: true,
        class: "btn-solid",
        autofocus: true,
        click: function () {
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
          const targetContainer = $("#addModal").dialog("option", "parent");
          const indexNumber = $("#addModal").dialog("option", "indexNumber");
          let fieldName = $(selectors.addModalNameInput).val();
          let selectedOption = $(selectors.addModalSelection)
            .find(":selected")
            .val();

          // fields in arrays do not get names
          if (utils.isArray(targetContainer)) {
            $(targetContainer)
              .parent()
              .children(".array-container")
              .val(selectedOption);
            fieldName = "";
          }

          createField.createFields(fieldName, selectedOption, targetContainer,indexNumber);
          $(selectors.addModalNameInput).val("");
          $(this).dialog("close");
          lazy.lazyLoad();
        },
      },
      {
        text: "Add to All",
        id: "addAll",
        disabled: true,
        class: "btn-solid",
        style: "display: none;",
        click: function () {
          undoHandlers.unsetRedo();
          undoHandlers.setUndo();
          const targetContainer = $("#addModal").dialog("option", "parent");
          const indexNumber = $("#addModal").dialog("option", "indexNumber");
          const parentContainer = $(targetContainer).parents()[1];
          const fieldName = $(selectors.addModalNameInput).val();
          let selectedOption = $(selectors.addModalSelection)
            .find(":selected")
            .val();

          allInArray.removeFromAllObjectsInArray(parentContainer, fieldName);
          allInArray.addToAllObjectsInArray(
            parentContainer,
            fieldName,
            selectedOption,
            indexNumber
          );

          $(selectors.addModalNameInput).val("");
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

export const addModal = (parent, indexNumber=null) => {
  $("#addModal").dialog("option", "parent", parent);
  $("#addModal").dialog("option", "indexNumber", indexNumber);
  const parentContainer = $(parent).parents()[2];

  if (!utils.isArray(parent)) {
    $(selectors.addModalNameTag).css("display", "block");
    $(selectors.addModalNameInput).css("display", "block");
    $("#addOne").button("disable");
    $("#addAll").button("disable");
  } else {
    $(selectors.addModalNameTag).css("display", "none");
    $(selectors.addModalNameInput).css("display", "none");
    $("#addAll").button("enable");
    $("#addOne").button("enable");
  }

  if (utils.isObjectInsideArray(parent)) {
    $("#addAll").css("display", "block");
  } else {
    $("#addAll").css("display", "none");
  }

  $("#addModal").dialog("open");
};

// modal toggle enabled create btn
$(selectors.addModalNameInput).on("input", function () {
  if ($(selectors.addModalNameInput).val() == "") {
    // empty
    $(selectors.addModalCreateBtn).prop("disabled", true);
    $(selectors.addModalDuplicateNameWarning).css("visibility", "hidden");
    $("#addAll").button("disable");
    $("#addOne").button("disable");
  } else {
    if (labelExists($(selectors.addModalNameInput).val())) {
      // duplicates found
      $(selectors.addModalCreateBtn).prop("disabled", true);
      $(selectors.addModalDuplicateNameWarning).css("visibility", "visible");
      $("#addAll").button("disable");
      $("#addOne").button("disable");
    } else {
      // not empty and no duplicates
      $(selectors.addModalDuplicateNameWarning).css("visibility", "hidden");
      $(selectors.addModalCreateBtn).prop("disabled", false);
      $("#addAll").button("enable");
      $("#addOne").button("enable");
    }
  }
});

// check if the a label with the same name already exists in the holding container
function labelExists(newLabel) {
  const holdingContainer = $("#addModal").dialog("option", "parent");
  const childLabels = $(holdingContainer).children().children("label");
  let exists = false;
  childLabels.map(function () {
    if ($(this).text() === newLabel) {
      exists = true;
    }
  });
  return exists;
}

export const toggleAddModalArrayMode = (isForArrayField) => {
  if (isForArrayField) {
    // $(selectors.addBtnModal).find(".modal-title").text("Set Array Type");
    //   $(selectors.addModalNameTag).hide();
    //   $(selectors.addModalNameInput).hide();
    $(selectors.addModalCreateBtn).prop("disabled", false);
  } else {
    //   $(selectors.addBtnModal).find(".modal-title").text("Add Object Field");
    $(selectors.addModalNameTag).show();
    $(selectors.addModalNameInput).show();
    $(selectors.addModalCreateBtn).prop("disabled", true);
  }
};

export const getElementIndex = (element) => {
  let parent = $(element).parent();
  return $(parent).children().index(element);
};
