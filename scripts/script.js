/*global $:false*/
/*global loadShaders:false*/
"use strict";

var STRING1 = "MAAPSRTTLMPPPFRLQLRLLILPILLLLRHDAVHAEPYSGGFGSSAVSSGGLGSVGIHIPGGGVGVITEARCPRVCSCTGLNVDCSHRGLTSVPRKISADVERLELQGNNLTVIYETDFQRLTKLRMLQLTDNQIHTIERNSFQDLVSLERLDISNNVITTVGRRVFKGAQSLRSLQLDNNQITCLDEHAFKGLVELEILTLNNNNLTSLPHNIFGGLGRLRALRLSDNPFACDCHLSWLSRFLRSATRLAPYTRCQSPSQLKGQNVADLHDQEFKCSGLTEHAPMECGAENSCPHPCRCADGIVDCREKSLTSVPVTLPDDTTDVRLEQNFITELPPKSFSSFRRLRRIDLSNNNISRIAHDALSGLKQLTTLVLYGNKIKDLPSGVFKGLGSLRLLLLNANEISCIRKDAFRDLHSLSLLSLYDNNIQSLANGTFDAMKSMKTVHLAKNPFICDCNLRWLADYLHKNPIETSGARCESPKRMHRRRIESLREEKFKCSWGELRMKLSGECRMDSDCPAMCHCEGTTVDCTGRRLKEIPRDIPLHTTELLLNDNELGRISSDGLFGRLPHLVKLELKRNQLTGIEPNAFEGASHIQELQLGENKIKEISNKMFLGLHQLKTLNLYDNQISCVMPGSFEHLNSLTSLNLASNPFNCNCHLAWFAECVRKKSLNGGAARCGAPSKVRDVQIKDLPHSEFKCSSENSEGCLGDGYCPPSCTCTGTVVACSRNQLKEIPRGIPAETSELYLESNEIEQIHYERIRHLRSLTRLDLSNNQITILSNYTFANLTKLSTLIISYNKLQCLQRHALSGLNNLRVVSLHGNRISMLPEGSFEDLKSLTHIALGSNPLYCDCGLKWFSDWIKLDYVEPGIARCAEPEQMKDKLILSTPSSSFVCRGRVRNDILAKCNACFEQPCQNQAQCVALPQREYQCLCQPGYHGKHCEFMIDACYGNPCRNNATCTVLEEGRFSCQCAPGYTGARCETNIDDCLGEIKCQNNATCIDGVESYKCECQPGFSGEFCDTKIQFCSPEFNPCANGAKCMDHFTHYSCDCQAGFHGTNCTDNIDDCQNHMCQNGGTCVDGINDYQCRCPDDYTGKYCEGHNMISMMYPQTSPCQNHECKHGVCFQPNAQGSDYLCRCHPGYTGKWCEYLTSISFVHNNSFVELEPLRTRPEANVTIVFSSAEQNGILMYDGQDAHLAVELFNGRIRVSYDVGNHPVSTMYSFEMVADGKYHAVELLAIKKNFTLRVDRGLARSIINEGSNDYLKLTTPMFLGGLPVDPAQQAYKNWQIRNLTSFKGCMKEVWINHKLVDFGNAQRQQKITPGCALLEGEQQEEEDDEQDFMDETPHIKEEPVDPCLENKCRRGSRCVPNSNARDGYQCKCKHGQRGRYCDQGEGSTEPPTVTAASTCRKEQVREYYTENDCRSRQPLKYAKCVGGCGNQCCAAKIVRRRKVRMVCSNNRKYIKNLDIVRKCGCTKKCYY";
var STRING2 = STRING1;

var w = STRING1.length,
    h = STRING2.length;
//NOTE max 5376*5376 with Firefox (10MB limit?)
console.time("load");
var idMat = new Uint8Array(w * h * 4);
for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
        var value = STRING1.charCodeAt(i) === STRING2.charCodeAt(j) ? 255 : 0;
        idMat[(i*w+j)*4] = value;
        idMat[(i*w+j)*4+1] = value;
        idMat[(i*w+j)*4+2] = value;
    }
}
console.timeEnd("load");

var webgl = function(canvas, shaders) {
    console.time("1");

    var WINDOW_SIZE = Math.floor($("window").value);
    var WIDTH = STRING1.length;
    console.log("sequence 1: " + WIDTH);
    var HEIGHT = STRING2.length;
    console.log("sequence 2: " + HEIGHT);
    var WIDTH_WINDOW = WIDTH + 1 - WINDOW_SIZE,
        HEIGHT_WINDOW = HEIGHT + 1 - WINDOW_SIZE;
    canvas.width = WIDTH_WINDOW;
    canvas.height = HEIGHT_WINDOW;
    canvas.style.width = WIDTH_WINDOW + "px";
    canvas.style.height = HEIGHT_WINDOW + "px";

    var gl = canvas.getContext(
        "webgl", {alpha: false, preserveDrawingBuffer: true}
    ) || canvas.getContext(
        "experimental-webgl", {alpha: false, preserveDrawingBuffer: true}
    );
    var program = gl.createProgram();

    for (var i = 0; i < shaders.length; i++) {
        var sh = gl.createShader(i % 2 === 0 ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        gl.shaderSource(sh, shaders[i]);
        gl.compileShader(sh);
        gl.attachShader(program, sh);
    }

    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,  1,  1,  1,  1, -1,
        -1,  1,  1, -1, -1, -1
    ]), gl.STATIC_DRAW);
    program.vertexPosAttrib = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.vertexPosArray);
    gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

    program.sizesUniform = gl.getUniformLocation(program, "uSizes");
    gl.uniform2f(program.sizesUniform, WIDTH, HEIGHT);

    program.windowUniform = gl.getUniformLocation(program, "uWindow");
    gl.uniform1i(program.windowUniform, WINDOW_SIZE);

    var texCoordLocation = gl.getAttribLocation(program, "aTexCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0, 0, WIDTH_WINDOW/WIDTH, WIDTH_WINDOW/WIDTH, WIDTH_WINDOW/WIDTH,
        0, 0, WIDTH_WINDOW/WIDTH, WIDTH_WINDOW/WIDTH, WIDTH_WINDOW/WIDTH, 0
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, idMat);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.activeTexture(gl.TEXTURE0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    var hist = new Uint8Array(WIDTH * HEIGHT * 4);
    gl.readPixels(0, 0, WIDTH, HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, hist);
    //counts every level of grey
    var histCount = new Uint32Array(256);
    for (var i = 0; i < hist.length; i += 4) {
        histCount[hist[i]]++;
    }
    //finds max value, levels and logs with values
    var histLog = new Uint8Array(256),
        maxCount = 0,
        levelsCount = 0,
        maxLog = 0;
    for (var i = 0; i < histCount.length; i++) {
        var tempCount = histCount[i];
        if (tempCount > 0) {
            var tempLog = Math.log(tempCount);
            histLog[i] = tempLog;
            if (maxLog < tempLog) {
                maxLog = tempLog;
            }
            levelsCount++;
            if (maxCount < tempCount) {
                maxCount = tempCount;
            }
        }
    }
    //make histogram
    var histogram = $("histogram");
    histogram.innerHTML = "";
    var fragment = document.createDocumentFragment();
    var barOriginal = document.createElementNS("http://www.w3.org/2000/svg", "line");
    barOriginal.setAttribute("y1", 100);
    barOriginal.style.stroke = "#06F";
    var logBarOriginal = document.createElementNS("http://www.w3.org/2000/svg", "line");
    logBarOriginal.style.stroke = "#f0e";
    var strokeWidth;
    if (levelsCount <= 128) {
        if (levelsCount <= 64) {
            strokeWidth = 4;
        } else {
            strokeWidth = 2;
        }
    } else {
        strokeWidth = 1;
    }
    barOriginal.style.strokeWidth = strokeWidth;
    logBarOriginal.style.strokeWidth = strokeWidth;
    var factorPercent = maxCount / 100;
    var factorLogPercent = maxLog / 100;
    for (var i = 0; i < 256; i++) {
        if (histCount[i]) {
            var bar = barOriginal.cloneNode();
            bar.setAttribute("x1", i + 0.5);
            bar.setAttribute("x2", i + 0.5);
            bar.setAttribute("y2", 100 - (histCount[i] / factorPercent));
            fragment.appendChild(bar);
            var logBar = logBarOriginal.cloneNode();
            var y = 100 - (histLog[i] / factorLogPercent);
            logBar.setAttribute("x1", i + 0.5);
            logBar.setAttribute("y1", y + 1);
            logBar.setAttribute("x2", i + 0.5);
            logBar.setAttribute("y2", y);
            fragment.appendChild(logBar);
        }
    }
    histogram.appendChild(fragment);
    var webglInput = $("webgl");
    webglInput.value = "Render WebGL graph";
    webglInput.disabled = false;
    console.timeEnd("1");
};

window.addEventListener("DOMContentLoaded", function() {
    var canvas = $("canvas");
    var container = $("container");

    if (canvas.style.webkitTransform !== undefined) {
        canvas.style.webkitTransform = "translateZ(0) scale(1)";
    } else {
        canvas.style.transform = "translateZ(0) scale(1)";
    }

    loadShaders(["dot.vertex.shader", "dot.fragment.shader"], function(shaders) {
        var webglInput = $("webgl");
        webglInput.addEventListener("click", function() {
            webglInput.disabled = true;
            webglInput.value = "Rendering…";
            webgl(canvas, shaders);
        }, false);
        webglInput.disabled = false;
    });

    //declaring listeners
    canvas.addEventListener("click", function(e) {
        console.log("pixel clicked at x: " + e.layerX + ", y: " + e.layerY);
    }, false);

    $("download").addEventListener("click", function() {
        var ghostAnchor = $("ghostAnchor");
        ghostAnchor.download = "image.png";
        try {
            canvas.toBlob(function(blob) {
                ghostAnchor.href = window.URL.createObjectURL(blob);
                ghostAnchor.click();
            });
        } catch(error) {
            console.log("canvas.toBlob not supported");
            ghostAnchor.href = canvas.toDataURL();
            ghostAnchor.click();
        }
    }, false);

    $("scale").addEventListener("input", function(e) {
        if (canvas.style.webkitTransform) {
            canvas.style.webkitTransform = canvas.style.webkitTransform.replace(/scale\(\d+\.?\d*\)/, "scale(" + (1/e.target.value) + ")");
        } else {
            canvas.style.transform = canvas.style.transform.replace(/scale\(\d+\.?\d*\)/, "scale(" + (1/e.target.value) + ")");
        }
    }, false);

    $("fullscreen").addEventListener("click", function() {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    }, false);

}, false);
