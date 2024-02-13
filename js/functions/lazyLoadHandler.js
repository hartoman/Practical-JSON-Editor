// how many screens away should the last check be
const THRESHOLD = 3;

export const lazyLoad = () => {
    makeFirstChildVisible()
    maketheRestVisible()
   }
   
   function makeFirstChildVisible() {
     const firstNode = $('.start-invisible:first-child')
     $(firstNode).removeClass('start-invisible')
   }
   
   function maketheRestVisible() {
     const allOthers = $('.start-invisible:not(:first-child)')
     $(allOthers).each( function() {
       const previous = $(this).prev();
       if (isInViewport(previous)) {
         $(this).removeClass('start-invisible')
         $(this).css('visibility', 'hidden');
   
         if (isInViewport($(this))) {
           $(this).css('visibility', 'visible');
         } else {
           $(this).addClass('start-invisible')
         }
       } 
   })
   
   }
   

   
   function isInViewport(element) {
     
     var elementTop = $(element).offset().top;
     var elementBottom = elementTop + $(element).outerHeight();
     var viewportTop = $(window).scrollTop();
     var viewportBottom = viewportTop + $(window).height();
   
     if (elementTop < viewportBottom*THRESHOLD && elementBottom > viewportTop) {
         // Element is at least partially within the viewport
      // console.log('Element is in viewport');
       return true
     } else {
         // Element is not within the viewport
     //  console.log('Element is not in viewport');
       return false
     }
   }
