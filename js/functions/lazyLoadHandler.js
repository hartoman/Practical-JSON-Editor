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

// how many screens away should the furthest check be
const THRESHOLD = 2;
let parent = null;

export const lazyLoad = () => {
    makeAllVisible()
};

function makeAllVisible() {
  let firstNode = $(".start-invisible:first-child");
  $(firstNode).removeClass("start-invisible");
  const allOthers = $(".start-invisible");

  $(allOthers).each(function () {
    const previous = $(this).prev();
    if (isInViewport(previous)) {
      $(this).removeClass("start-invisible");
    }

    /*  TODO: try to break loop for optimization
    else {
      return false; 
     }
     */
  });
}

export const isInViewport = (element) => {
  var elementTop = $(element).offset().top;
  var elementBottom = elementTop + $(element).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  if (elementTop < viewportBottom * THRESHOLD && elementBottom > viewportTop) {
    // Element is at least partially within the viewport
    return true;
  } else {
    // Element is not within the viewport
    return false;
  }
};

export const setParentNode = (startPoint) => {
  parent = startPoint;
};
