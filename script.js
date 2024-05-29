
var addTabButton = document.getElementById("add-tab-btn");
var addNotebook = document.getElementById("add-notebook-btn");

var container = document.getElementById("container");

var notepads = document.getElementsByClassName("notepad");
var tabs = document.getElementsByClassName("tab-box");

var notebookSection = document.getElementById('notebooks-section');

var tabCounter = 1;
var notebookCounter = 1;

var tabsData = [];
var notebooksData = []; // Notebooks will be an array of tabs/notepads

var openedTab;
var openedNotepad;
var openedNotebook;

var notepadDefaultText = "Type here...";

var settingsButton = document.getElementById("settings-btn");
var settingsPanel = document.getElementById("settings-panel");

var overlayBackground = document.getElementById("overlay");

// Buttons
var clearButton = document.getElementById("clear-btn");

settingsButton.addEventListener("click", function() {
    settingsPanel.style.display = "flex";
    overlayBackground.style.display = "block";
});

overlayBackground.addEventListener("click", function() {
    settingsPanel.style.display = "none";
    overlayBackground.style.display = "none";
});

addTabButton.addEventListener("click", function() {
    createTab();
})

clearButton.addEventListener("click", function() {
    clearAllTabs();
});

function clearAllTabs(){
    localStorage.clear();
    location.reload();
}

function createTab () //creates a new tab
{
    var tab_id = 'tab-' + tabCounter;
    var tab_name = 'New tab ' + tabCounter;
    // This creates the Tab button
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
    tabWindow.id = 'notepadTab-' + tabCounter;
    tabWindow.className = 'notepad';
    tabWindow.placeholder = notepadDefaultText; // placeholder text
    container.appendChild(tabWindow);

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
        tabName: tab_name,
        text: tabWindow.value
    };
    
    tabsData.push(tab_data);
    saveTabs();
    console.log('Created a tab id ' + tabWindow.id + ' with class name ' + tabWindow.className)
    
    tabCounter++;
    openTab(tabWindow.id, tab_id);

    notebooksData.tabsData?.push(tab_data);// Inserts the tab to the notebook

}
function openTab(notepad_id, tab_id) { //opens a tab
    for (let i = 0; i < notepads.length; i++) {
        notepads[i].style.display = "none";
    }
    document.getElementById(notepad_id).style.display = "block";
    
    if(openedTab != null)
    {
        document.getElementById(openedTab).style.filter = 'saturate(250%)';
        document.getElementById(openedTab).style.opacity = '.9';
        document.getElementById(openedTab).style.height = 'fit-content';
        document.getElementById(openedTab).style.transform = 'translateY(0px)';

    }
    openedTab = tab_id;
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

            var tab_data = tabsData.find(tabData => tabData.id === tab_.id);
            
                tab_data.tabName = new_name;
                saveTabs();

                console.log('Changed ' + tab_.id + ' from ' + currentName_ + 'to ' + tab_.tabName)
                console.log(tabsData);
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
    localStorage.setItem("savedTabs", JSON.stringify(tabsData));
    localStorage.setItem("Tab Counter", tabCounter);
}
function saveContent(tab_id, content_) { // saves the specified notepad's text contents
    var tab = tabsData.find(tab => tab.id == tab_id);
    tab.text = content_;

    saveTabs();
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

    tabsData = tabsData.filter(tab => tab.id !== tab_id);
    saveTabs();

    if(openedTab === tab_id)
    {
        openedTab = null;
        notepad_id = null;
    }

    // Open the last tab if any
    // // if (tabsData.length > 0) {
    // //     var lastTab = tabsData[tabsData.length - 1];
    // //     openTab(lastTab.notepadID, lastTab.tabID);
    // // } else {
    // //     openedTab = null;
    // //     openedNotepad = null;
    // // }

    // openTab(openedNotepad, openedTab);
}

function load() // loads all the tabs
{  

    // tabCounter = localStorage.getItem("Tab Counter");

    var data = JSON.parse(localStorage.getItem("savedTabs"));

    if(Array.isArray(data)){
        tabsData = data;
        tabsData.forEach(function(currentTab) {
            var tabID = currentTab.id;
            var tabName = currentTab.tabName;
            // This creates the Tab button
            var tab = document.createElement("div");
            tab.id = tabID;
            var span = document.createElement("span");
            tab.appendChild(span);
            span.textContent = tabName; 

            tab.className = 'tab-box';
            document.getElementById("tabs-section").insertBefore(tab, addTabButton);

            //#region Close button
            // This creates the close button and make it functional
            var closeButton = document.createElement('img');
            
            closeButton.className = 'close-btn';
            
            tab.appendChild(closeButton);

            closeButton.addEventListener('click', function(event) {
                event.stopPropagation();
                closeTab(tabWindow.id, tab.id);
            });
            //#endregion

            // This creates the Tab window

            var tabWindow = document.createElement("textarea");

            //this will check if there's another tab that has an id of "New Tab"
            tabWindow.id = 'notepadTab-' + tabCounter;
            tabWindow.className = 'notepad';
            container.appendChild(tabWindow);
            tabWindow.textContent = currentTab.text;
            tabWindow.placeholder = notepadDefaultText; // placeholder text

            //This will make the tab clickable 
            tab.addEventListener("click", function() {
                openTab(tabWindow.id, tabID);
            });

            tab.addEventListener('dblclick', function() {
                renameTab(tab);
            });
            // adds the save function that will be called when the text content changes
            tabWindow.addEventListener('input', function() {
                saveContent(tabID, tabWindow.value);
            })

            console.log('Created a tab id ' + tabWindow.id + ' with class name ' + tabWindow.className)
            
            tabCounter++;
            openTab(tabWindow.id, tabID);
        });
    }  
}

addNotebook?.addEventListener("click", function(){
    createNotebook();
})
createNotebook();
function createNotebook() { // This will create the UI for the notebook
    var notebook_name = 'Notebook ' + notebookCounter;
    var notebook_id = 'notebookID-' + notebookCounter;
    var notebook_data = {
        name: notebook_name,
        id: notebook_id,
        tabsData: []
    };

    notebooksData.push(notebook_data);

    var notebook_ = document.createElement('div');
    notebook_.textContent = notebook_name;
    // var input_ = document.createElement('input');
    // input_.className = 'notebook-rename';
    // notebook_.firstChild.replaceWith(input_);
    // input_.focus();
    // notebook_.textContent = input_.value;
    // notebook_.id = notebook_id;

    notebook_.className = 'notebook';

    notebookSection?.appendChild(notebook_);
}


function openNotebook(notebook_id) {
    openedNotebook = notebook_id;

}


if(JSON.parse(localStorage.getItem("savedTabs")) == null)
{
    createTab();
} else {
    load(); 
}

