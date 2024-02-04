import * as jsonHandlers from './jsonHandlers.js';

const selectors = {
    mainContainer: "#mainContainer",
}

let undoAction = {}
let redoAction = {}

export const setUndo = () => {

    undoAction = jsonHandlers.createJsonObj($(selectors.mainContainer));

}

export const setRedo = () => {
    
}

export const unsetUndo = () => {
    
}

export const unsetRedo = () => {
    
}

export const undo = () => {
    
    let topArray = $(selectors.mainContainer).children('.array-wrapper');
    // if the main container contains only an array, then it is an array-object
    let holdingContainer = (topArray.length===$(selectors.mainContainer).children().length) ? topArray.children('.array-container') : $(selectors.mainContainer);

    
    
    if (Object.keys(undoAction).length) {
//        $(selectors.mainContainer).empty(); // remove contents of main
        $(holdingContainer).empty()
        jsonHandlers.printLoadedJson(undoAction, holdingContainer);
        undoAction = {};
      }
}

export const redo = () => {
    
}
