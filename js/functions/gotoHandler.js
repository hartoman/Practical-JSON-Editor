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
    utils.setTopFoldBtnToFolded();
    currentIndex++;
  }
};

export const resetGoto = () => {
  currentIndex = 0;
};
