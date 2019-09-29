

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, accordion=true);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems);
});
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

function Enable() {
    var element = document.getElementsByClassName("enable");
    for(var i=0;i<element.length;i++){
        element[i].removeAttribute('disabled');
    }
};

function bold(){
    var element = document.getElementsByClassName("bold");
    var element1 = document.getElementsByClassName("tobold");
    var pItem = document.createElement("b")
    element1[0].appendChild(pItem);
};

function italiac(){
    var element = document.getElementsByClassName("italiac");
    var element1 = document.getElementsByClassName("toItaliac");
    var pItem = document.createElement("i")
    element1[0].appendChild(pItem);
};
 function quitar(){
    var element = document.getElementsByClassName("quitar");
    var element1 = document.getElementsByClassName("toItaliac");
    var pItem = document.createElement("p")
    element1[0].appendChild(pItem);
 }

document.addEventListener('DOMContentLoaded',function(){
    var elems = document.querySelectorAll('.tabs');
    var instances = M.Tabs.init(elems);
});