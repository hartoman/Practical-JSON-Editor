import * as utils from "../utils.js";

const selectors = {
  renameModalNameTag: "#renameModalNameTag",
  renameModalNameInput: "#renameModalNameInput",
  renameModalDuplicateNameWarning: ".duplicate-warning-label",
  renameModalSelection: "#modalSelection",
};

/** rename field modal */
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
      $(".ui-widget-overlay").css({ opacity: ".9" });
    },
    buttons: [
      {
        text: "Rename",
        id: "renameOne",
        disabled: true,
        class: "btn-solid",
        click: function () {
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
          const parent = $("#renameModal").dialog("option", "parent");
          const oldName = $(parent).children("label").text();
          const newName = $(selectors.renameModalNameInput).val();
          const parentContainer = $(parent).parents()[2];
          utils.renameAllObjectsInArray(parentContainer, oldName, newName);
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
