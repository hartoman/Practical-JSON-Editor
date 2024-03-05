import * as lazy from "./lazyLoadHandler.js";

const selectors = {
  mainContainer: "#mainContainer",
  selectedElements: ".icon-select-on",
};

let currentIndex = 0;

export const cycleSelected = () => {
  if (currentIndex >= $(selectors.selectedElements).length) {
    currentIndex = 0;
  }

  const cur = $(selectors.selectedElements).get(currentIndex);
  const allAncestors = $(cur).parents();
  $(allAncestors).removeClass("d-none start-invisible");
  let firstNode = $(".start-invisible").first();
  let sel = $(firstNode).nextUntil($(cur), '.start-invisible')
  $(sel).removeClass('start-invisible')


 /*
  const parentObjectWrapper = $(cur).parents()[2];
  const previousSiblingsofParent = $(parentObjectWrapper).prevAll();

  $(previousSiblingsofParent).removeClass("start-invisible");
 */



 // $(previousSiblingsofParent).find('.start-invisible').removeClass("start-invisible");
  // TODO: does not work in scenario: fakelos 3 selected, fakelos 1 unwrapped
  


  $(selectors.selectedElements).get(currentIndex).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  lazy.lazyLoad();
  currentIndex++;
};
