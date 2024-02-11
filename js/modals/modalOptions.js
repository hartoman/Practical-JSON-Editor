const selectors = {
  optionsModal: "#optionsModal",
  darkmodeCheckbox: "#darkmode-checkbox",
  toggleTooltipsCheckbox: "#show-tooltips-checkbox",
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
