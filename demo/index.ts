import "pixi.js";
import * as hljs from "highlight.js";
import MultiStyleText from "..";

hljs.initHighlightingOnLoad();

PIXI.settings.RESOLUTION = 2;
let renderer = PIXI.autoDetectRenderer(600, 2680, {
    backgroundColor: 0x333333
});
document.getElementById("pixi-container").appendChild(renderer.view);
let stage = new PIXI.Container();

// Basics
let text = new MultiStyleText("Let's make some <ml>multiline</ml>\nand <ms>multistyle</ms> text for\n<pixi>Pixi.js!</pixi>",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#cccccc",
            align: "center"
        },
        "ml": {
            fontStyle: "italic",
            fill: "#ff8888"
        },
        "ms": {
            fontStyle: "italic",
            fill: "#4488ff"
        },
        "pixi": {
            fontSize: "64px",
            fill: "#efefef"
        }
    });

text.x = 300 - text.width / 2;
text.y = 150;
stage.addChild(text);

// Nesting Tags
let nested = new MultiStyleText("You can <outline>nest <b>tags <red>as <i>deeply <thicker>as <shadow>you'd <large>like</large></shadow></thicker></i></red></b></outline>",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#cccccc"
        },
        "outline": { stroke: "black", strokeThickness: 2 },
        "b": { fontWeight: "700" },
        "red": { fill: "#ff8888" },
        "i": { fontStyle: "italic" },
        "thicker": { strokeThickness: 6 },
        "shadow": { dropShadow: true, dropShadowColor: "#888888" },
        "large": { fontSize: "36px" }
    });

nested.x = 300 - nested.width / 2;
nested.y = 550;
stage.addChild(nested);

// Vertical Alignment
let valign = new MultiStyleText("You can use <code>valign</code> <top>to</top> <middle>control</middle> <baseline>the</baseline> <bottom>vertical</bottom> <custom1>alignment</custom1> <custom2>of</custom2> <custom3>text</custom3>.",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#cccccc"
        },
        "code": {
            fontFamily: "Inconsolata",
            fontSize: "36px",
            fill: "#ff8888"
        },
        "top": { fontSize: "14px", valign: "top" },
        "middle": { fontSize: "14px", valign: "middle" },
        "bottom": { fontSize: "14px", valign: "bottom" },
        "baseline": { fontSize: "14px", valign: "baseline" },
        "custom1": { fontSize: "14px", valign: 5 },
        "custom2": { fontSize: "14px", valign: -70 },
        "custom3": { fontSize: "14px", valign: 25 }
    });

valign.x = 300 - valign.width / 2;
valign.y = 960;
stage.addChild(valign);

// Wrapping and Alignment
let wrapping = new MultiStyleText("Global word wrap and alignment properties are controlled by the \"default\" style, and can't be overridden by other styles.",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#cccccc",
            wordWrap: true,
            wordWrapWidth: 150,
            align: "right"
        }
    });

wrapping.x = 550 - wrapping.width;
wrapping.y = 1220;
stage.addChild(wrapping);

// Wrapping and Alignment II
let wrapping2 = new MultiStyleText("全局设置的<blue>对齐</blue>属性由「默认」来<big>控制</big>。而且不能被<blue>别的样式</blue>所<red>覆盖</red>。",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "16px",
            fill: "#cccccc",
            wordWrap: true,
            wordWrapWidth: 250,
            breakWords: true,
        },
        "blue": { fill: 0x4488ff, stroke: 0x2244cc, fontSize: "24px" },
        "red": { fill: 0xff8888, stroke: 0xcc4444 },
        "big": { fill: 0x88ff88, stroke: 0x44cc44, fontSize: "36px" }
    });

wrapping2.x = 440 - wrapping2.width;
wrapping2.y = 1700;
stage.addChild(wrapping2);

// Debug Mode
let debug = new MultiStyleText("You can use <code>debug mode</code> to help you figure out what your text is doing.  You can use <blue>global, </blue><red>static</red> settings or <no-debug>override those with the <code>debug</code> style option.</no-debug>",
    {
        "default": {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#cccccc",
            wordWrap: true,
            wordWrapWidth: 500,
        },
        "code": {
            fontFamily: "Inconsolata",
            fontSize: "36px",
            fill: "#ff8888"
        },
        "blue": { fill: 0x4488ff, stroke: 0x2244cc },
        "red": { fill: 0xff8888, stroke: 0xcc4444 },
        "no-debug": { debug: false }
    });

MultiStyleText.debugOptions.spans.enabled = true;
MultiStyleText.debugOptions.objects.enabled = true;

debug.x = 300 - debug.width / 2;
debug.y = 2050;
stage.addChild(debug);

MultiStyleText.debugOptions.spans.enabled = false;
MultiStyleText.debugOptions.objects.enabled = false;

// Have Fun
let funStyles = {
    "default": {
        fontFamily: "Arial",
        fontSize: "24px",
        fill: "#cccccc",
        strokeThickness: 1,
        stroke: "#aaaaaa",
        dropShadow: true,
        dropShadowBlur: 10,
        dropShadowDistance: 8,
        dropShadowAngle: 0
    },
    "blue": { fill: 0x4488ff, stroke: 0x2244cc },
    "red": { fill: 0xff8888, stroke: 0xcc4444 }
};

let fun = new MultiStyleText("Now have fun making some <blue>beautiful</blue> <red>multistyle</red> text!", funStyles);

fun.x = 300 - fun.width / 2;
fun.y = 2480;
stage.addChild(fun);

// Animate
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);

    funStyles.default.dropShadowAngle += 0.02;
    funStyles.default.dropShadowBlur = Math.sin(funStyles.default.dropShadowAngle + Math.PI / 4) * 5 + 5;
    fun.styles = funStyles;
}

requestAnimationFrame(animate);
