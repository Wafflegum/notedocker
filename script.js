
var addTab = document.getElementById("add-tab-btn");
var container = document.getElementById("container");

var notepads = document.getElementsByClassName("notepad");

var tabCounter = 1;

addTab.addEventListener("click", function() {
    var tabID = 'tab-' + tabCounter;
    var tabName = 'New tab ' + tabCounter;
    // This creates the Tab button
    var tab = document.createElement("div");
    tab.textContent = tabName;
    tab.className = 'tab-box';
    document.getElementById("tabs-section").insertBefore(tab, addTab);

    // This creates the Tab window

    var tabWindow = document.createElement("textarea");

    //this will check if there's another tab that has an id of "New Tab"
    tabWindow.id = tabID;
 

    tabWindow.className = 'notepad';
    container.appendChild(tabWindow);

    //This will make the tab clickable 
    tab.addEventListener("click", function() {
        openTab(tabWindow.id);
    });

    tab.addEventListener('dblclick', function() {
        renameTab(tab);
    });
    console.log('Created a tab id ' + tabWindow.id + ' with class name ' + tabWindow.className)
    tabCounter++;

    openTab(tabWindow.id);
})

function openTab(tabName) {
    for (let i = 0; i < notepads.length; i++) {
        notepads[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
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
    input.value = '';
    input.className = 'rename-input';
    tab.firstChild.replaceWith(input);
    input.focus();

    input.addEventListener("blur", function(){
        newName = input.value;
        var span = document.createElement('span');
        
        span.textContent = newName;
        input.replaceWith(span);
    })
    input.addEventListener('keydown', function(event){
        var key = event.key;
        if(key === 'Enter'){
            newName = input.value;
            var span = document.createElement('span');
            
            span.textContent = newName;
            input.replaceWith(span);
        }
    })

}