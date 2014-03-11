/*  jshint worker: true */
"use strict";
addEventListener("message", function(e) {
    var size = e.data.w * e.data.h * 2,
        step = Math.floor(size / 50),
        verts = new Float32Array(size);
    for (var i = 0; i < verts.length; i+=2) {
        verts[i] = ((i / 2) % e.data.w + 0.5);//x
        verts[i+1] = e.data.h - Math.floor((i / e.data.w) / 2) - 0.5;//y
        if (i % step === 0) {
            this.postMessage(Math.floor(i / e.data.w) * 25 / e.data.h - 1);
        }
    }
    this.postMessage(verts.buffer, [verts.buffer]);
    this.close();
}, false);
