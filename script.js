var container = document.getElementById("container");
var notepads = document.getElementsByClassName("notepad");

var notebookSection = document.getElementById('notebooks-section');

var notebookCounter = 0;

var notebookDatabase = []; // Notebooks will be an array of tabs/notepads

var openedTabID;
var openedNotepad;
var openedNotebook = [];

var notepadDefaultText = "Type here...";


// Buttons
var clearButton = document.getElementById("clear-btn");
var addTabButton = document.getElementById("add-tab-btn");
var addNotebook = document.getElementById("add-notebook-btn");

// Settings variables
var settingsButton = document.getElementById("settings-btn");
var settingsPanel = document.getElementById("settings-panel");
// Appearance
var appearanceButton = document.getElementById("appearance-btn");
var appearancePage = document.getElementById("appearance-page");

var aboutButton = document.getElementById("about-btn");
var aboutPage = document.getElementById("about-page");

var textContrastSlider = document.getElementById("text-contrast");
var backgroundOpacitySlider = document.getElementById("background-opacity");

var overlayBackground = document.getElementById("overlay");

// CSS Variables
var root = document.querySelector(":root");



// Settings
settingsButton.addEventListener("click", function() { // opens the settings panel
    settingsPanel.style.display = "flex";
    overlayBackground.style.display = "block";
});


overlayBackground.addEventListener("click", function() { // This closes the settings page when you click off the page
    settingsPanel.style.display = "none";
    overlayBackground.style.display = "none";
});

// Appearance
appearanceButton.addEventListener("click", function() {
    appearancePage.style.display = "block";
    aboutPage.style.display = "none";
});

textContrastSlider.oninput = () => {
    root.style.setProperty("--text-contrast", textContrastSlider.value * 0.001);
};

backgroundOpacitySlider.oninput = () => {
    root.style.setProperty("--background-opacity", backgroundOpacitySlider.value * 0.001);
};

// About
aboutButton.addEventListener('click', function() {
    aboutPage.style.display = "block";
    appearancePage.style.display = "none";
});


// Tab Buttons

addTabButton.addEventListener("click", function() { // Adds tab when you click the add tab button
    createTab();
})

clearButton.addEventListener("click", function() {
    clearAllTabs();
});

function clearAllTabs(){
    localStorage.clear();
    location.reload();
}

function createTab (tabID, tabName, text, loadMode) //creates a new tab
{
    if(!loadMode)
        openedNotebook.tab_counter++;

    var tab_id = tabID || 'tab-' + openedNotebook.tab_counter;
    var tab_name = tabName || 'New tab ' + openedNotebook.tab_counter;

    // This creates the Tab
    var tab_ = document.createElement("div");
    tab_.id = tab_id;
    var span = document.createElement("span");
    tab_.appendChild(span);
    span.textContent = tab_name;
    tab_.className = 'tab-box';
    document.getElementById("tabs-section").insertBefore(tab_, addTabButton);

    // This creates the Tab window

    var tabWindow = document.createElement("textarea");

    //this will check if there's another tab that has an id of "New Tab"
    tabWindow.id = `notepad-${openedNotebook.id}-${tab_id}`;
    tabWindow.className = 'notepad';
    tabWindow.placeholder = notepadDefaultText; // placeholder text
    container.appendChild(tabWindow);

    if(text)
        tabWindow.value = text || '';

    //This will make the tab clickable 
    tab_.addEventListener("click", function() {
        openTab(tabWindow.id, tab_id);
    });

    tab_.addEventListener('dblclick', function() {
        renameTab(tab_, span);
    });
    // adds the save function that will be called when the text content changes
    tabWindow.addEventListener('input', function() {
        saveContent(tab_id, tabWindow.value);
    })

    //#region Close button
    // This creates the close button and make it functional
    var closeButton = document.createElement('img');
    
    closeButton.className = 'close-btn';
    
    tab_.appendChild(closeButton);

    closeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        closeTab(tabWindow.id, tab_.id);
    });
    //#endregion

    var tab_data = {
        id: tab_id,
        name: tab_name,
        text: tabWindow.value
    };
    
    // // tabsData.push(tab_data);
    if(!loadMode){
        var notebook_ = notebookDatabase.find(nb => nb.id === openedNotebook.id);

        if(notebook_){
            notebookDatabase.find(nb => nb.id === openedNotebook.id).tabs_data.push(tab_data);
            saveNotebooks();
        } else {
            console.error('No opened notebook found');
        }
    }

    saveTabs();
    
    openTab(tabWindow.id, tab_id);

}
function openTab(notepad_id, tab_id) { //opens a tab
    for (let i = 0; i < notepads.length; i++) {
        notepads[i].style.display = "none";
    }
    document.getElementById(notepad_id).style.display = "block";
    
    if(document.getElementById(openedTabID))
    {
        document.getElementById(openedTabID).style.filter = 'saturate(250%)';
        document.getElementById(openedTabID).style.opacity = '.9';
        document.getElementById(openedTabID).style.height = 'fit-content';
        document.getElementById(openedTabID).style.transform = 'translateY(0px)';

    }
    openedTabID = tab_id;
    openedNotepad = notepad_id;

    document.getElementById(tab_id).style.filter = 'brightness(110%) saturate(250%)';
    document.getElementById(tab_id).style.height = '90%';
    document.getElementById(tab_id).style.transform = 'translateY(-5px)';
}

function renameTab (tab_) { // this renames the tab
    var currentName_ = tab_.firstChild.textContent;
    // var newName = prompt('Enter tab name');
    // if(newName){
    // tab.textContent = newName;
    // }

    // console.log('Renamed ' + currentName + ' to ' + newName);
    
    var input_ = document.createElement('input');
    input_.type = 'text';
    input_.value = currentName_;
    input_.className = 'rename-input';
    input_.maxLength = 30;
    input_.style.flexBasis = '100';
    tab_.firstChild.replaceWith(input_);
    input_.focus();

    input_.addEventListener("blur", function(){
        var new_name = input_.value;
        var span_;
        span_ = document.createElement('span');
        
        if(new_name.trim() !== ''){
            
            span_.textContent = new_name;
            input_.replaceWith(span_);

            var nb = notebookDatabase.find(nb => nb.id === openedNotebook.id);
            var tab = nb.tabs_data.find(t => t.id === tab_.id);
            
            tab.name = new_name;
            saveNotebooks();

            console.log('Changed ' + tab_.id + ' from ' + currentName_ + ' to ' + tab.name)
        } else {
            span_.textContent = currentName_;
            input_.replaceWith(span_);
        }
    });
    input_.addEventListener('keydown', function(event){
        var key_ = event.key;
        if(key_ === 'Enter'){
            event.preventDefault();
            input_.blur();
        }
    });
}

function saveTabs(){ // this will save all the tabs
    //// localStorage.setItem("savedTabs", JSON.stringify(tabsData));
    // // localStorage.setItem("Tab Counter", tabCounter);
}
function saveContent(tab_id, content_) { // saves the specified notepad's text contents

    var tab = openedNotebook.tabs_data.find(tab => tab.id == tab_id);
    tab.text = content_;

    saveNotebooks();
}

function closeTab(notepad_id, tab_id) {
    var tabElement = document.getElementById(tab_id);
    console.log('closed ' + notepad_id + ' ' + tab_id);
    if (tabElement){
        tabElement.remove();
    }

    var notepadElement = document.getElementById(notepad_id);

    if (notepadElement)
        notepadElement.remove();

    openedNotebook.tabs_data = openedNotebook.tabs_data.filter(tab => tab.id !== tab_id);

    saveTabs();

    if(openedTabID === tab_id)
    {
        openedTabID = null;
        notepad_id = null;
    }

    // Open the last tab if any
    // // if (tabsData.length > 0) {
    // //     var lastTab = tabsData[tabsData.length - 1];
    // //     openTab(lastTab.notepadID, lastTab.tab_id);
    // // } else {
    // //     openedTab = null;
    // //     openedNotepad = null;
    // // }

    // openTab(openedNotepad, openedTab);
}

// // function loadTabs(notebook_id) // loads all the tabs
// // {  
// //     tabCounter = JSON.parse(localStorage.getItem("Tab Counter"));

// //     notebooksData = JSON.parse(localStorage.getItem("Notebooks"));

// //     console.log('Loading tabs for notebook: ' + notebook_id);

// //     var openedNotebook_data = notebooksData.find(data_ => data_.id === notebook_id);

// //     console.log(openedNotebook_data);
// //     if(Array.isArray(openedNotebook_data)){
// //         openedNotebook_data.tabsData.forEach(function(currentTab) {

// //             createTab(currentTab.id, currentTab.name, currentTab.textContent);
// //             // tabCounter++;

// //             // var tab_id = currentTab.id;
// //             // var tab_name = currentTab.tabName;
// //             // // This creates the Tab button
// //             // var tab_ = document.createElement("div");
// //             // tab_.id = tab_id;
// //             // var span = document.createElement("span");
// //             // tab_.appendChild(span);
// //             // span.textContent = tab_name; 

// //             // tab_.className = 'tab-box';
// //             // document.getElementById("tabs-section").insertBefore(tab_, addTabButton);

// //             // //#region Close button
// //             // // This creates the close button and make it functional
// //             // var closeButton_ = document.createElement('img');
            
// //             // closeButton_.className = 'close-btn';
            
// //             // tab_.appendChild(closeButton_);

// //             // closeButton_.addEventListener('click', function(event) {
// //             //     event.stopPropagation();
// //             //     closeTab(tabWindow_.id, tab_.id);
// //             // });
// //             // //#endregion

// //             // // This creates the Tab window

// //             // var tabWindow_ = document.createElement("textarea");
            
// //             // //this will check if there's another tab that has an id of "New Tab"
// //             // tabWindow_.id = 'notepad-' + tab_id;
// //             // tabWindow_.className = 'notepad';
// //             // container.appendChild(tabWindow_);
// //             // tabWindow_.textContent = currentTab.text;
// //             // tabWindow_.placeholder = notepadDefaultText; // placeholder text

// //             // //This will make the tab clickable 
// //             // tab_.addEventListener("click", function() {
// //             //     openTab(tabWindow_.id, tab_id);
// //             // });

// //             // tab_.addEventListener('dblclick', function() {
// //             //     renameTab(tab_);
// //             // });
// //             // // adds the save function that will be called when the text content changes
// //             // tabWindow_.addEventListener('input', function() {
// //             //     saveContent(tab_id, tabWindow_.value);
// //             // })
            
// //             // openTab(tabWindow_.id, tab_id);
// //         });
// //     }  
// //     tabCounter = JSON.parse(localStorage.getItem("Tab Counter"));

// // }


// Notebook
addNotebook?.addEventListener("click", function(){
    createNotebook();
})
function createNotebook(name__, id__, tabs__data, tab__counter, loadMode) {
    notebookCounter++;
    // This will create the UI for the notebook
    var notebook_data = {
        name: name__ || 'Notebook ' + notebookCounter,
        id: id__ || 'notebook-' + notebookCounter,
        tabs_data: tabs__data || [],
        tab_counter: tab__counter || 0
    };

    // UI section
    var notebook_ui = document.createElement('div');
    
    notebook_ui.className = 'notebook';
    notebook_ui.id = notebook_data.id;
    
    var notebook_text = document.createElement('span');
    notebook_text.textContent = notebook_data.name;
    notebook_ui.appendChild(notebook_text);
    
    notebookSection.appendChild(notebook_ui);
    
    notebook_ui.addEventListener('click', function(){
        openNotebook(notebook_data.id);
    });

    if(!loadMode){
        console.log('Created notebook');
        notebookDatabase.push(notebook_data);
        saveNotebooks();
    }

    openNotebook(notebook_data.id);

}
function openNotebook(notebook__id) {
    if(openedNotebook.id !== notebook__id){
        var notebookUI = document?.getElementById(openedNotebook.id);
        
        if(notebookUI){
            notebookUI.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            notebookUI.style.color = 'var(--text-color-UI)';
        }

        openedNotebook = notebookDatabase.find(notebook => notebook.id === notebook__id); //searches for the notebook we'll open in the notebook database
        
        var tabs_ = document.querySelectorAll('.tab-box');

        tabs_?.forEach(tab => {
            tab.remove();
        })

        if(openedNotebook.tabs_data.length === 0){
            console.error(`No tabs found in ${openedNotebook.id}. Creating one for it.`);
            createTab();
        } else {
            openedNotebook.tabs_data.forEach(element => {
                createTab(element.id, element.name, element.text, true);
            });
        }

        notebookUI = document?.getElementById(openedNotebook.id);
        
        if(notebookUI){
            notebookUI.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
            notebookUI.style.color = 'rgba(255, 255, 255, 1)';
        }
    }
}

function saveNotebooks() {
    console.log("Saving notebook");
    localStorage.setItem("Notebooks", JSON.stringify(notebookDatabase));
}

function loadNotebooks() {
    notebookDatabase = JSON.parse(localStorage.getItem("Notebooks"));
    
    notebookDatabase.forEach(notebook => {
        createNotebook(notebook.name, notebook.id, notebook.tabs_data, notebook.tab_counter, true);
    });

    openNotebook(notebookDatabase[0].id);
}

if(JSON.parse(localStorage.getItem("Notebooks")) == null) {
    createNotebook();
    console.log('fresh start!');
} else {
    loadNotebooks(); 
    console.log('Loaded all notebooks');
}
