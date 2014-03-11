//miscellaneous functions to be used across the whole application
"use strict";

/*exported $*/
//shortcut for getElementById
function $(id) {
    return document.getElementById(id);
}

/*exported xhr2*/
//makes async requests
function xhr2(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "text";
    req.onload = function() {
        if (this.status === 200) {
            callback(this.response);
        }
    };
    req.send();
}

/*exported loadShaders*/
//loads shaders from the server
function loadShaders (shaders, callback) {
    var responses = [];
    var aggregateResponses = function(shaderText) {
        responses.push(shaderText);
        if (responses.length === shaders.length) {
            callback(responses);
        }
    };
    for (var i = 0; i < shaders.length; i++) {
        xhr2("shaders/" + shaders[i], aggregateResponses);
    }
}
