import * as utils from './utils.js';


/** add field modal */
export const initAddModal = () => {
  $("#addModal").dialog({
    autoOpen: false,
    title: "Add field",
    modal: true,
    draggable: false,
    resizable: false,
    width:400,
    parent: {},
    open:function() {
      $('.ui-widget-overlay').css({ opacity: '.9' });
      
    },
    buttons: [
      {
        text: "Add",
        class:'btn-solid',
        click: function () {
          const targetContainer = $("#addModal").dialog("option", "parent")

          $(this).dialog("close");
        },
      },
      {
        text: "Add to All",
        id: "addAll",
        class:'btn-solid',
        style: "display: none;",
        click: function () {
          const targetContainer = $("#addModal").dialog("option", "parent");
          const parentContainer = $(targetContainer).parents()[2];
          const fieldName = $(targetContainer).children("label").text();
       //   utils.removeFromAllObjectsInArray(parentContainer, fieldName);
          $(this).dialog("close");
        },
      },
      {
        text: "Cancel",
        class:'btn-solid',
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });
};


export const addModal = (parent) => { 

  $("#addModal").dialog("option", "parent", parent);  
  const parentContainer = $(parent).parents()[2];

  if ( utils.isArray(parentContainer)) { 
    $("#addAll").css("display", "block");
  } else if ( $(parent).attr("id")==='mainContainer'||!utils.isArray(parentContainer)) {
    $("#addAll").css("display", "none");
  }

  $("#addModal").dialog("open");

}
