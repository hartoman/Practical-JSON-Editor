const clipboardContent ="oioioioioi"

export const initClipboardModal = () => {
    $("#clipboardModal").dialog({
      autoOpen: false,
      title: "Clipboard",
      modal: true,
      draggable: false,
      resizable: false,
      parent: {},
      open: function () {
        $(".ui-widget-overlay").css({ opacity: ".7" });
      },
      buttons: [
        {
          text: "Clear Clipboard",
          class: "btn-solid",
          click: function () {
            $(this).dialog("close");
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
  
export const clipboardModal = (copiedtext) => {
//  const jsonString = JSON.stringify(copiedtext, null, 2);
    $('#clipboardContent').html(copiedtext)
    $("#clipboardModal").dialog("open");
  };