/*  jshint worker: true */
"use strict";
addEventListener("message", function(e) {
    var size = e.data.w * e.data.h,
        step = Math.floor(size / 50),
        colors = new Float32Array(size);
    for (var i = 0; i < colors.length; i++) {
        var score = 0.0;
        for (var j = 0; j < e.data.windowSize; j++) {
            if (e.data.s1[i % e.data.w] === e.data.s2[Math.floor(i / e.data.w)]) {
                score += 1.0;
            }
        }
        colors[i] = score / e.data.windowSize;
        if (i % step === 0) {
            this.postMessage(Math.floor(i / e.data.w) * 50 / e.data.h - 1);
        }
    }
    this.postMessage(colors.buffer, [colors.buffer]);
    this.close();
}, false);
