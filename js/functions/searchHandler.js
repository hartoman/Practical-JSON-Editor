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
  searchInput: "#searchInput",
  timesFoundText: "#foundNumber",
  topSearchBtn: "#searchBtn",
};

let currentIndex = 0;
let numOccurences = 0;
let foundIn;

// modal toggle enabled search btn
$(selectors.searchInput).on("input", function () {
  if ($(selectors.searchInput).val() == "") {
    // empty
    $(selectors.searchModalCreateBtn).prop("disabled", true);
    //$(selectors.timesFoundText).css("visibility", "hidden");
    $(selectors.timesFoundText).addClass('foundNumberLabel-invisible')
    $("#search").button("disable");
    foundIn=null
  } else {
    const searchValue = $(selectors.searchInput).val();
    let regex = new RegExp(`.*(${searchValue}).*`);

    // Use the filter method to select inputs containing the regex pattern
    const possibleInputs = $("#mainContainer").find("input[type=text],input[type=number],textarea");

    foundIn = $(possibleInputs).filter(function () {
      return regex.test($(this).val());
    });

    // Select all input elements of type text and number that have a specific value
    numOccurences = $(foundIn).length;
    if (!numOccurences) {
      // value not found
      $("#search").button("disable");
    } else {
      // not empty and value found
      $("#search").button("enable");
    }
    $(selectors.timesFoundText).removeClass('foundNumberLabel-invisible')
    $(selectors.timesFoundText).text(`Found ${numOccurences} times`);
  }
});

$(selectors.searchInput).on("focusout", function () {
$('.highlight').removeClass('highlight')
});

$(selectors.topSearchBtn).on("focusout", function () {
  $('.highlight').removeClass('highlight')
  });

export const cycleFound = () => {
  const instances = foundIn || 0;
  
  if (instances.length > 0) {
    if (currentIndex >= $(instances).length) {
      currentIndex = 0;
    }

    const cur = $(instances).get(currentIndex);
    const allAncestors = $(cur).parents();
    $(allAncestors).removeClass("start-invisible");
    utils.onlyUnfold(allAncestors)

    let firstNode = $(".start-invisible").first();
    let sel = $(firstNode).nextUntil($(cur), ".start-invisible");
    $(sel).removeClass("start-invisible");

    cur.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    // $(cur).focus();
    $('.highlight').toggleClass('highlight')
    $(cur).toggleClass('highlight')
    utils.setTopFoldBtnToFolded();
    currentIndex++;
    $(selectors.timesFoundText).text(`${currentIndex} / ${numOccurences}`);
  }
};

export const resetSearch = () => {
  $(selectors.searchInput).val("");
  currentIndex = 0;
  $(selectors.timesFoundText).addClass('foundNumberLabel-invisible');
  $(selectors.timesFoundText).text(`Found 0 times`);
};


$(selectors.searchInput).on("keydown", function (e) {
  $(selectors.topSearchBtn).trigger('click')
  /*if (e.keyCode === 13 && numOccurences) {
    cycleFound();
  }*/
})