# Practical JSON Editor

## LICENSE

> ###### Copyright © 2024 Christos Chartomatsidis. 

> "Practical JSON Editor" is free software: you can redistribute it and/or modify it under the terms of the Creative Commons Attribution-ShareAlike 4.0 International License.
>
> You should have received a copy of the Creative Commons Attribution-ShareAlike 4.0 International License along with this program. If not, see  
<https://creativecommons.org/licenses/by-sa/4.0/>.
>
> - This software is provided on an "as-is" basis, meaning without any warranties or guarantees of any kind. 
>
> - You must give appropriate credit and indicate if changes were made.
>
> - You must distribute under the same license as the original, **even if modified**.

## RELEASE NOTES
Release version 1.0.1:

> - Text and Numbers are now both using the text input field, which is then parsed based on content, to string, number or null.
> - Minor bugfixes
> - changed fieldnames width from fixed to dynamic, so as to display the entire name

## DESCRIPTION
Practical JSON Editor is a personal project created for fun and learning. Its purpose is to make an easy to use tool for myself and others who wish to create and edit .json files.  
<br>
 With PJE you can load .json files or even open .xml and .csv files transformed into json format to edit and save.  
<br>
This app works only on the client side, so no information is collected, everything stays on your computer.   
<br>
There are no cookies, and the only the selected visual options are saved in your local storage.

## HOW TO USE
Here are explained the functions of all the buttons, grouped by function and location.
### Top-Right Corner
- ⚙ Options : Opens options dialog.  
Options include dark-mode and turning tooltips on/off.
- ℹ Info : Opens the README.md in a new tab (which you are currently reading).

### First Row
#### Left-side
- 📄 **New**: Prepares the document for a new json file. No file is actually created until you click on ''save'.
- 📂 **Load**: You can load not only json files but also xml and csv spreadsheets.  
*Warning:* The app works good with files of small size (tested up to 2 Mb). Depending on the format and size of the file, there might be memory issues from the massive dynamic creation of html elements on the browser. Tread lightly.
- 💾 **Save**: Saves the current file in 'Downloads' folder.  
*Warning*: due to the key-value nature of the json, if for some reason (i.e. copypaste) there exist 2 or more keys with the same name (same label), all but one will be overwritten during the save.

#### Right-side
- 🔍 **Search**: Searches all text and number fields for the text typed in the input. By clicking on the button repeatedly, you can cycle through all found instances.

### Second Row
#### Left-side
- {❋} **Add Object/Text/Number**: Creates a named object, text, number field at the top level of the document. Elements created this way will *always have labels and the file will always be object-type*. If such an element is created, 'Add Array' option will be hidden.
- [#] **Add Array**: Creates an array as the top level element of the document. The file will be of *array-type and the elements directly under that array will not have labels*. If an Array is created, elements can only be created / pasted inside it.
- ◆ **Paste from clipboard**: Pastes content copied in the clipboard to the top-level. This will have similar effects to the Add Object button.
- ✥ / ✦ **Expand/Fold all**: Expands or folds all objects and arrays in the document (see below).

#### Right-side
- ↟ **Go to Top**: Navigates to the top of the page.
- ★ **Go to tagged elements**: Cycles through the tagged elements. With every click on this button you go to the next tagged element.
- ⟲ **Undo**: Get back *one* addition, deletion etc.
- ⟳ **Redo**: Undo *one* 'undo' that you just did.
- 📋 **Clipboard**: Opens up the clipboard, where you can see what elements you have copied. May clear the clipboard to avoid accidental paste.
- ⊗ **Clear contents**: deletes all elements of the documents.

### Inside Object and Array Containers
The buttons from left to right:

- ☆ / ★ **Tag/untag element**: Tags an element as a sort of 'bookmark' so that you can find it again quickly. More than one elements may be tagged.
- ✕ **Delete**: Deletes element and all its children
- **Name Label** : The 'key' of the attribute. Can by renamed by clicking on it.  
 *Warning*: Make sure that each label has a unique name, to avoid accidental overwritting.
- **{❋} / [#] Label**: This does not do anything, it is just an icon to easily discern between objects and arrays
- ✥ / ✦ **Expand/Fold**: When a object or array container is created, it begins folded so that everything can be neat and tidy. By clicking on this icon, the container is expanded, and you can see more options as well as its children.
- ✚ **Add**: It adds a labelled field if the container is an object or an unlabelled one if it is an array.
- ⊗ **Clear** : Deletes all children fields of the container
- ⧉ **Copy contents to clipboard** : copies all descendant nodes and their values to the clipboard.
- ◆ **Paste from clipboard** : pastes the nodes that are copied in the clipboard to the current container.  
 *Attention*: if you copy from object and paste to array, all the labels will be removed.  
If on the other hand you copy from array and paste in object, then the labels for all elements will be generated and you have to rename them.



## CONTACT
To report a bug, issue, or any general feedback, drop me a line at:
christoschartomatsidis1985@gmail.com