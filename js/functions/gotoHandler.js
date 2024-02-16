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
  $(allAncestors).removeClass("d-none");

  $(selectors.selectedElements).get(currentIndex).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  currentIndex++;
};
