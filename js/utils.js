export const isArray = (inputContainer) => { 
    return $(inputContainer).parent().children(".array-container").length;
}


export const removeFromAllObjectsInArray = (parentContainer, fieldName)=> {
    let siblingObjects = $(parentContainer).children().children(".obj-container");
  
    siblingObjects.map(function () {
      let preexistingLabels = $(this).children().children("label");
      let fieldwithsamename = preexistingLabels.filter(function () {
        return $(this).text() === fieldName;
      });
      if (fieldwithsamename.length) {
        $(fieldwithsamename).parent().remove();
      }
    });
  }