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
