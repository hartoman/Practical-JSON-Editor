const selectors = {
    mainContainer: "#mainContainer",
    undoBtn: "#undoBtn",
    redoBtn:"#redoBtn"
}

let undoAction = {}
let redoAction = {}

export const setUndo = () => {
    undoAction = $(selectors.mainContainer).contents().not($(selectors.mainContainer)).clone(true);
    $(selectors.undoBtn).attr('disabled',false)
}

export const setRedo = () => {
    redoAction = $(selectors.mainContainer).contents().not($(selectors.mainContainer)).clone(true);
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
   
    if (Object.keys(undoAction).length) {
        setRedo();
        $($(selectors.mainContainer)).html(undoAction);
        unsetUndo();
    }
}

export const redo = () => {
    if (Object.keys(redoAction).length) {
        setUndo();
        $($(selectors.mainContainer)).html(redoAction);
        unsetRedo();
    }
}
