// how many screens away should the furthest check be
const THRESHOLD = 2;
let parent = null;

export const lazyLoad = () => {
  //  const startingPoint = $("#mainContainer");
//  makeGroupVisible(parent);
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
    else {
      $(this).addClass("start-invisible");
    }
    /*  TODO: try to break loop for optimization
    else {
      return false; 
     }
     */
  });
}


/*
export const makeGroupVisible = () => {
  const groupedNodes = $(parent).children(".start-invisible");
  let numtimes = 0;
  const firstNode = $(groupedNodes).first();
  $(firstNode).removeClass("start-invisible");
  numtimes++
  const siblings = $(groupedNodes).slice(1);

  $(siblings).each(function () {
    const previous = $(this).prev();
    if (isInViewport(previous)) {
      $(this).removeClass("start-invisible");
      if (!isInViewport($(this))) {
        $(this).addClass("start-invisible");
      }
    } else {
      return false;
    }
    numtimes++;
  });
  console.log(`siblings:${numtimes}`);
};
*/
export const isInViewport = (element) => {
  var elementTop = $(element).offset().top;
  var elementBottom = elementTop + $(element).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  if (elementTop < viewportBottom * THRESHOLD && elementBottom > viewportTop) {
    // Element is at least partially within the viewport
    // console.log('Element is in viewport');
    return true;
  } else {
    // Element is not within the viewport
    //  console.log('Element is not in viewport');
    return false;
  }
};

export const setParentNode = (startPoint) => {
  parent = startPoint;
};
