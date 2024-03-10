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