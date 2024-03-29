import * as utils from "../functions/utils.js";

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
  $(allAncestors).removeClass("start-invisible");
  utils.toggleFold(allAncestors);

  let firstNode = $(".start-invisible").first();
  let sel = $(firstNode).nextUntil($(cur), ".start-invisible");
  $(sel).removeClass("start-invisible");

  if ($(selectors.selectedElements).length) {
    $(selectors.selectedElements).get(currentIndex).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    currentIndex++;
  }
};

export const resetGoto = () => {
  currentIndex = 0;
};
