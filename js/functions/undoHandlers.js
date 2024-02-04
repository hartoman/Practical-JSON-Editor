import * as jsonHandlers from './jsonHandlers.js';

const selectors = {
    mainContainer: "#mainContainer",
    undoBtn: "#undoBtn",
    redoBtn:"#redoBtn"
}

let undoAction = {}
let redoAction = {}

export const setUndo = () => {
    undoAction = jsonHandlers.createJsonObj($(selectors.mainContainer));
    $(selectors.undoBtn).attr('disabled',false)
}

export const setRedo = () => {
    redoAction = jsonHandlers.createJsonObj($(selectors.mainContainer));
    $(selectors.redoBtn).attr('disabled',false)
}

export const unsetUndo = () => {
    undoAction = {};
    $(selectors.undoBtn).attr('disabled',true)
}

export const unsetRedo = () => {
    redoAction = {};
    $(selectors.redoBtn).attr('disabled',true)
}

export const undo = () => {
    
    let topArray = $(selectors.mainContainer).children('.array-wrapper');
    // if it is an array-object
    let holdingContainer = ($(selectors.mainContainer).children().children("label").length === 0) ? topArray.children('.array-container') : $(selectors.mainContainer);
 
    if (Object.keys(undoAction).length) {
        setRedo();
        $(holdingContainer).empty()
        jsonHandlers.printLoadedJson(undoAction, holdingContainer);
        unsetUndo();
    }
}

export const redo = () => {
    let topArray = $(selectors.mainContainer).children('.array-wrapper');
    // if it is an array-object
    let holdingContainer = ($(selectors.mainContainer).children().children("label").length === 0) ? topArray.children('.array-container') : $(selectors.mainContainer);
 
    if (Object.keys(redoAction).length) {
        setUndo();
        $(holdingContainer).empty();
        jsonHandlers.printLoadedJson(redoAction, holdingContainer);
        unsetRedo();
    }
}
