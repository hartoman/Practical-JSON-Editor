import * as lazy from "./lazyLoadHandler.js";

const selectors = {
  searchInput: "#searchInput",
  timesFoundText: "#foundNumber",
};

let currentIndex = 0;
let numOccurences = 0;
let foundIn;

// modal toggle enabled search btn
$(selectors.searchInput).on("input", function () {
  if ($(selectors.searchInput).val() == "") {
    // empty
    $(selectors.searchModalCreateBtn).prop("disabled", true);
    $(selectors.timesFoundText).css("visibility", "hidden");
    $("#search").button("disable");
  } else {
    const searchValue = $(selectors.searchInput).val();

    let regex = new RegExp(`.*(${searchValue}).*`);

    // Use the filter method to select inputs containing the regex pattern
    const possibleInputs = $("#mainContainer").find("input");

    foundIn = $(possibleInputs).filter(function () {
      return regex.test($(this).val());
    });

    // Select all input elements of type text and number that have a specific value
    //   const foundIn = $('input[type=text][value="' + regex + '"], input[type=number][value="' + searchValue + '"]'); //
    numOccurences = $(foundIn).length;
    if (!numOccurences) {
      // value not found
      $("#search").button("disable");
    } else {
      // not empty and value found
      $("#search").button("enable");
    }
    $(selectors.timesFoundText).css("visibility", "visible");
    $(selectors.timesFoundText).text(`Found ${numOccurences} times`);
  }
});

export const cycleFound = () => {
  const searchValue = $(selectors.searchInput).val();
  //instances = $('input[type=text][value="' + searchValue + '"], input[type=number][value="' + searchValue + '"]'); //;
  const instances = foundIn;
  
  if (instances.length > 0) {
    if (currentIndex >= $(instances).length) {
      currentIndex = 0;
    }

    const cur = $(instances).get(currentIndex);
    const allAncestors = $(cur).parents();
    //  const parentObjectWrapper = $(cur).parents()[2];
    //  const previousSiblingsofParent = $(parentObjectWrapper).prevAll();
    $(allAncestors).removeClass("d-none start-invisible");
    //   $(previousSiblingsofParent).removeClass("start-invisible");

    let firstNode = $(".start-invisible").first();
    let sel = $(firstNode).nextUntil($(cur), ".start-invisible");
    $(sel).removeClass("start-invisible");

    cur.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    lazy.lazyLoad();
    currentIndex++;

    $(selectors.timesFoundText).text(`${currentIndex} / ${numOccurences}`);
  }
};

export const resetSearch = () => {
  $(selectors.searchInput).val("");
  currentIndex = 0;
  $(selectors.timesFoundText).css("visibility", "hidden");
  $(selectors.timesFoundText).text(`Found 0 times`);
};
