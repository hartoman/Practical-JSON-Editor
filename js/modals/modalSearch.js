import * as utils from "../functions/utils.js";

const selectors = {
  searchModalNameTag: "#searchModalNameTag",
  searchModalNameInput: "#searchModalNameInput",
  searchModalDuplicateNameWarning: "#searchModal .duplicate-warning-label",
  searchModalSelection: "#modalSelection",
};

export const initSearchModal = () => {
  $("#searchModal").dialog({
    autoOpen: false,
    title: "Search field",
    modal: false,
    draggable: true,
    resizable: false,
    width: 400,
    foundItems:{},
    buttons: [
      {
        text: "Find Next",
        id: "search",
        disabled: true,
        class: "btn-solid",
        click: function () {
          const foundItems =$(this).dialog("option", "foundItems")
          $(foundItems).each(function(){
              $(this).parents().removeClass('d-none start-invisible');
              return false; // Break the loop after finding the first visible field
          });
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

export const searchModal = (parent) => {

  $("#searchModal").dialog("open");
};


// modal toggle enabled create btn
$(selectors.searchModalNameInput).on("input", function () {
  if ($(selectors.searchModalNameInput).val() == "") {
    // empty
    $(selectors.searchModalCreateBtn).prop("disabled", true);
    $(selectors.searchModalDuplicateNameWarning).css("visibility", "hidden");
    $("#search").button("disable");
  } else {

    const searchValue = $(selectors.searchModalNameInput).val();
// Select all input elements of type text and number that have a specific value
    const foundIn = $('input[type=text][value="' + searchValue + '"], input[type=number][value="' + searchValue + '"]');//
    $("#searchModal").dialog("option", "foundItems", foundIn); 
    const numOccurences = $(foundIn).length;
    if (!numOccurences) {
      // value not found
      $(selectors.searchModalCreateBtn).prop("disabled", true);
      $("#search").button("disable");
    } else {
      // not empty and value found
      $(selectors.searchModalCreateBtn).prop("disabled", false);
      $("#search").button("enable");
    }
    $(selectors.searchModalDuplicateNameWarning).css("visibility", "visible");
    $(selectors.searchModalDuplicateNameWarning).text(`Found ${numOccurences} times`)
  }
});