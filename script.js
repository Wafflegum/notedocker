
var addTab = document.getElementById("add-tab-btn");
var container = document.getElementById("container");

var notepads = document.getElementsByClassName("notepad");
var tabs = document.getElementsByClassName("tab-box");

var tabCounter = 1;
var tabsData = [];

var openedTab;

addTab.addEventListener("click", function() {
    createTab();
})

function createTab ()
{
    var tabID = 'tab-' + tabCounter;
    var tabName = 'New tab ' + tabCounter;
    // This creates the Tab button
    var tab = document.createElement("div");
    tab.id = tabID;
    tab.textContent = tabName;
    tab.className = 'tab-box';
    document.getElementById("tabs-section").insertBefore(tab, addTab);

    // This creates the Tab window

    var tabWindow = document.createElement("textarea");

    //this will check if there's another tab that has an id of "New Tab"
    tabWindow.id = 'notepadTab-' + tabCounter;
    tabWindow.className = 'notepad';
    container.appendChild(tabWindow);

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

    var tabData = {
        id: tabID,
        tabName: tabName,
        text: tabWindow.value
    };

    tabsData.push(tabData);
    saveTabs();
    console.log('Created a tab id ' + tabWindow.id + ' with class name ' + tabWindow.className)
    
    tabCounter++;
    openTab(tabWindow.id, tabID);
}
function openTab(notepadID, tabID) {
    for (let i = 0; i < notepads.length; i++) {
        notepads[i].style.display = "none";
    }
    document.getElementById(notepadID).style.display = "block";
    
    if(openedTab != null)
    {
        document.getElementById(openedTab).style.filter = 'saturate(250%)';
    }
    openedTab = tabID;

    document.getElementById(tabID).style.filter = 'brightness(110%) saturate(250%)';
}

function renameTab (tab) {
    var currentName = tab.textContent;
    // var newName = prompt('Enter tab name');
    // if(newName){
    // tab.textContent = newName;
    // }

    // console.log('Renamed ' + currentName + ' to ' + newName);
    
    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'rename-input';
    input.maxLength = 30;
    input.style.flexBasis = '100';
    tab.firstChild.replaceWith(input);
    input.focus();

    input.addEventListener("blur", function(){
        var newName = input.value;
        var span;
        span = document.createElement('span');
        

        if(newName.trim() !== ''){
            
            span.textContent = newName;
            input.replaceWith(span);

            var tabData = tabsData.find(tabData => tabData.id === tab.id);
            
                tabData.tabName = newName;
                saveTabs();

                console.log('Changed ' + tab.id + ' from ' + currentName + 'to ' + tab.tabName)
                console.log(tabsData);
        } else {
            span.textContent = currentName;
            input.replaceWith(span);
        }
    });
    input.addEventListener('keydown', function(event){
        var key = event.key;
        if(key === 'Enter'){
            event.preventDefault();
            input.blur();
        }
    });
}

function saveTabs(){ // this will save all the tabs
    localStorage.setItem("savedTabs", JSON.stringify(tabsData));
}
function saveContent(tabID, content) { // saves the specified notepad's text contents
    var tab = tabsData.find(tab => tab.id == tabID);
    tab.text = content;

    saveTabs();
}

function load()
{
    var data = JSON.parse(localStorage.getItem("savedTabs"));

    if(Array.isArray(data)){
        tabsData = data;
        tabsData.forEach(function(currentTab) {
            var tabID = currentTab.id;
            var tabName = currentTab.tabName;
            // This creates the Tab button
            var tab = document.createElement("div");
            tab.id = tabID;
            tab.textContent = tabName;
            tab.className = 'tab-box';
            document.getElementById("tabs-section").insertBefore(tab, addTab);

            // This creates the Tab window

            var tabWindow = document.createElement("textarea");

            //this will check if there's another tab that has an id of "New Tab"
            tabWindow.id = 'notepadTab-' + tabCounter;
            tabWindow.className = 'notepad';
            container.appendChild(tabWindow);
            tabWindow.textContent = currentTab.text;
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

if(JSON.parse(localStorage.getItem("savedTabs")) == null)
{
    createTab();
} else {
    load(); 
}
console.log(JSON.parse(localStorage.getItem("savedTabs")));

