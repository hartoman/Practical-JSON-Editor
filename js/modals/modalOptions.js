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

const selectors = {
  optionsModal: "#optionsModal",
  darkmodeCheckbox: "#darkmode-checkbox",
  toggleTooltipsCheckbox: "#show-tooltips-checkbox",
  allCheckboxes: "#optionsModal input"
};

export const initOptionsModal = () => {
  $(selectors.optionsModal).dialog({
    autoOpen: false,
    title: "Options",
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
        text: "Close",
        class: "btn-solid",
        click: function () {
          saveSettings();
          $(this).dialog("close");
        },
      },
    ],
  });
};

export const optionsModal = () => {
  $(selectors.optionsModal).dialog("open");
};

// button that switches between dark mode and normal
$(selectors.darkmodeCheckbox).on("change", function () {
  $("body").toggleClass("json-editor-dark");

});

// button that toggles tooltips
$(selectors.toggleTooltipsCheckbox).on("change", function () {
  $("body").toggleClass("showTooltips");

});


function saveSettings() {
  const userOptions= saveOptionsObj();
  utils.saveObjectToStorage(userOptions,"options")
}



function saveOptionsObj() {
  const userOptions={};
  if ($(selectors.darkmodeCheckbox).prop('checked')) {
    userOptions.darkmode = true;
  } else {
    userOptions.darkmode = false;
  }
  if ($(selectors.toggleTooltipsCheckbox).prop('checked')) {
    userOptions.showTooltips = true;
  } else {
    userOptions.showTooltips = false;
  }
  return userOptions;
}


export const  loadSettings =()=> {
  const userOptions = utils.loadObjectFromStorage('options')
  if ($(userOptions).length) {
    if (userOptions.darkmode) {
      $(selectors.darkmodeCheckbox).trigger('click');
    }
    if (userOptions.showTooltips) {
      $(selectors.toggleTooltipsCheckbox).trigger('click');
    }
  }
}