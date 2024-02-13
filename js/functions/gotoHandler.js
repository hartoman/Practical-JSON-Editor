const selectors = {
    mainContainer: "#mainContainer",
    selectedElements:".icon-select-on"
  };

let currentIndex = 0;
  
export const cycleSelected=()=> {
    currentIndex++;
    if (currentIndex >= $(selectors.selectedElements).length) {
      currentIndex = 0;
    }
    
    $(selectors.selectedElements).get(currentIndex).scrollIntoView({
        behavior: 'instant',
        block: 'center'
      });
  }
  

