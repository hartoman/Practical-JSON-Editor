import * as lazy from "./lazyLoadHandler.js";

const selectors = {
  searchInput: "#searchInput",
  timesFoundText: "#foundNumber",
};

let currentIndex = 0;

// modal toggle enabled search btn
$(selectors.searchInput).on("input", function () {
  if ($(selectors.searchInput).val() == "") {
    // empty
    $(selectors.searchModalCreateBtn).prop("disabled", true);
    $(selectors.timesFoundText).css("visibility", "hidden");
    $("#search").button("disable");
  } else {
    const searchValue = $(selectors.searchInput).val();
    // Select all input elements of type text and number that have a specific value
    const foundIn = $('input[type=text][value="' + searchValue + '"], input[type=number][value="' + searchValue + '"]'); //
    const numOccurences = $(foundIn).length;
    if (!numOccurences) {
      // value not found
      $(selectors.searchModalCreateBtn).prop("disabled", true);
      $("#search").button("disable");
    } else {
      // not empty and value found
      $(selectors.searchModalCreateBtn).prop("disabled", false);
      $("#search").button("enable");
    }
    $(selectors.timesFoundText).css("visibility", "visible");
    $(selectors.timesFoundText).text(`Found ${numOccurences} times`);
  }
});

export const cycleFound = () => {
  const searchValue = $(selectors.searchInput).val();
  const instances = $('input[type=text][value="' + searchValue + '"], input[type=number][value="' + searchValue + '"]'); //;

  if (instances.length) {
    if (currentIndex >= $(instances).length) {
      currentIndex = 0;
    }

    const cur = $(instances).get(currentIndex);
    const allAncestors = $(cur).parents();
    const parentObjectWrapper = $(cur).parents()[2];
    const previousSiblingsofParent = $(parentObjectWrapper).prevAll();

    $(allAncestors).removeClass("d-none start-invisible");
    $(previousSiblingsofParent).removeClass("start-invisible");
    cur.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    lazy.lazyLoad();
    currentIndex++;
  }
};

export const resetSearch = () => {
  $(selectors.searchInput).val("");
  currentIndex = 0;
  $(selectors.timesFoundText).css("visibility", "hidden");
  $(selectors.timesFoundText).text(`Found 0 times`);
};
