/// <reference types="pixi.js" />
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MultiStyleText = (function (_super) {
    __extends(MultiStyleText, _super);
    function MultiStyleText(text, styles) {
        var _this = _super.call(this, text) || this;
        _this.checkSpace = function (result) {
            var c = result.slice(result.length - 1, result.length);
            if (c !== " ") {
                result += " ";
            }
            return result;
        };
        _this.styles = styles || {};
        return _this;
    }
    Object.defineProperty(MultiStyleText.prototype, "styles", {
        set: function (styles) {
            this.textStyles = {};
            this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
            for (var style in styles) {
                if (style === "default") {
                    this.assign(this.textStyles["default"], styles[style]);
                }
                else {
                    this.textStyles[style] = this.assign({}, styles[style]);
                }
            }
            this._style = new PIXI.TextStyle(this.textStyles["default"]);
            this.dirty = true;
        },
        enumerable: true,
        configurable: true
    });
    MultiStyleText.prototype.setTagStyle = function (tag, style) {
        if (tag in this.textStyles) {
            this.assign(this.textStyles[tag], style);
        }
        else {
            this.textStyles[tag] = this.assign({}, style);
        }
        this._style = new PIXI.TextStyle(this.textStyles["default"]);
        this.dirty = true;
    };
    MultiStyleText.prototype.deleteTagStyle = function (tag) {
        if (tag === "default") {
            this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
        }
        else {
            delete this.textStyles[tag];
        }
        this._style = new PIXI.TextStyle(this.textStyles["default"]);
        this.dirty = true;
    };
    MultiStyleText.prototype._getTextDataPerLine = function (lines) {
        var outputTextData = [];
        var tags = Object.keys(this.textStyles).join("|");
        var re = new RegExp("</?(" + tags + ")>", "g");
        var styleStack = [this.assign({}, this.textStyles["default"])];
        var tagNameStack = ["default"];
        // determine the group of word for each line
        for (var i = 0; i < lines.length; i++) {
            var lineTextData = [];
            // find tags inside the string
            var matches = [];
            var matchArray = void 0;
            while (matchArray = re.exec(lines[i])) {
                matches.push(matchArray);
            }
            // if there is no match, we still need to add the line with the default style
            if (matches.length === 0) {
                lineTextData.push(this.createTextData(lines[i], styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
            }
            else {
                // We got a match! add the text with the needed style
                var currentSearchIdx = 0;
                for (var j = 0; j < matches.length; j++) {
                    // if index > 0, it means we have characters before the match,
                    // so we need to add it with the default style
                    if (matches[j].index > currentSearchIdx) {
                        lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx, matches[j].index), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                    }
                    if (matches[j][0][1] === "/") {
                        if (styleStack.length > 1) {
                            styleStack.pop();
                            tagNameStack.pop();
                        }
                    }
                    else {
                        styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[matches[j][1]]));
                        tagNameStack.push(matches[j][1]);
                    }
                    // update the current search index
                    currentSearchIdx = matches[j].index + matches[j][0].length;
                }
                // is there any character left?
                if (currentSearchIdx < lines[i].length) {
                    lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                }
            }
            outputTextData.push(lineTextData);
        }
        return outputTextData;
    };
    MultiStyleText.prototype.getFontString = function (style) {
        return new PIXI.TextStyle(style).toFontString();
    };
    MultiStyleText.prototype.createTextData = function (text, style, tagName) {
        return {
            text: text,
            style: style,
            width: 0,
            height: 0,
            fontProperties: undefined,
            tagName: tagName
        };
    };
    MultiStyleText.prototype.getDropShadowPadding = function () {
        var _this = this;
        var maxDistance = 0;
        var maxBlur = 0;
        Object.keys(this.textStyles).forEach(function (styleKey) {
            var _a = _this.textStyles[styleKey], dropShadowDistance = _a.dropShadowDistance, dropShadowBlur = _a.dropShadowBlur;
            maxDistance = Math.max(maxDistance, dropShadowDistance || 0);
            maxBlur = Math.max(maxBlur, dropShadowBlur || 0);
        });
        return maxDistance + maxBlur;
    };
    MultiStyleText.prototype.updateText = function () {
        var _this = this;
        if (!this.dirty) {
            return;
        }
        this.texture.baseTexture.resolution = this.resolution;
        var textStyles = this.textStyles;
        var outputText = this.text;
        if (this._style.wordWrap) {
            outputText = this.wordWrap(this.text);
        }
        // split text into lines
        var lines = outputText.split(/(?:\r\n|\r|\n)/);
        // get the text data with specific styles
        var outputTextData = this._getTextDataPerLine(lines);
        // calculate text width and height
        var lineWidths = [];
        var lineYMins = [];
        var lineYMaxs = [];
        var maxLineWidth = 0;
        for (var i = 0; i < lines.length; i++) {
            var lineWidth = 0;
            var lineYMin = 0;
            var lineYMax = 0;
            for (var j = 0; j < outputTextData[i].length; j++) {
                var sty = outputTextData[i][j].style;
                this.context.font = this.getFontString(sty);
                // save the width
                outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
                if (outputTextData[i][j].text.length === 0) {
                    outputTextData[i][j].width += (outputTextData[i][j].text.length - 1) * sty.letterSpacing;
                    if (j > 0) {
                        lineWidth += sty.letterSpacing / 2; // spacing before first character
                    }
                    if (j < outputTextData[i].length - 1) {
                        lineWidth += sty.letterSpacing / 2; // spacing after last character
                    }
                }
                lineWidth += outputTextData[i][j].width;
                // save the font properties
                outputTextData[i][j].fontProperties = PIXI.TextMetrics.measureFont(this.context.font);
                // save the height
                outputTextData[i][j].height =
                    outputTextData[i][j].fontProperties.fontSize + outputTextData[i][j].style.strokeThickness;
                if (typeof sty.valign === "number") {
                    lineYMin = Math.min(lineYMin, sty.valign - outputTextData[i][j].fontProperties.descent);
                    lineYMax = Math.max(lineYMax, sty.valign + outputTextData[i][j].fontProperties.ascent);
                }
                else {
                    lineYMin = Math.min(lineYMin, -outputTextData[i][j].fontProperties.descent);
                    lineYMax = Math.max(lineYMax, outputTextData[i][j].fontProperties.ascent);
                }
            }
            lineWidths[i] = lineWidth;
            lineYMins[i] = lineYMin;
            lineYMaxs[i] = lineYMax;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }
        // transform styles in array
        var stylesArray = Object.keys(textStyles).map(function (key) { return textStyles[key]; });
        var maxStrokeThickness = stylesArray.reduce(function (prev, cur) { return Math.max(prev, cur.strokeThickness || 0); }, 0);
        var dropShadowPadding = this.getDropShadowPadding();
        var totalHeight = lineYMaxs.reduce(function (prev, cur) { return prev + cur; }, 0) - lineYMins.reduce(function (prev, cur) { return prev + cur; }, 0);
        // define the right width and height
        var width = maxLineWidth + maxStrokeThickness + 2 * dropShadowPadding;
        var height = totalHeight + 2 * dropShadowPadding;
        this.canvas.width = (width + this.context.lineWidth) * this.resolution;
        this.canvas.height = height * this.resolution;
        this.context.scale(this.resolution, this.resolution);
        this.context.textBaseline = "alphabetic";
        this.context.lineJoin = "round";
        var basePositionY = dropShadowPadding;
        var drawingData = [];
        // Compute the drawing data
        for (var i = 0; i < outputTextData.length; i++) {
            var line = outputTextData[i];
            var linePositionX = void 0;
            switch (this._style.align) {
                case "left":
                    linePositionX = dropShadowPadding;
                    break;
                case "center":
                    linePositionX = dropShadowPadding + (maxLineWidth - lineWidths[i]) / 2;
                    break;
                case "right":
                    linePositionX = dropShadowPadding + maxLineWidth - lineWidths[i];
                    break;
            }
            for (var j = 0; j < line.length; j++) {
                var _a = line[j], style = _a.style, text = _a.text, fontProperties = _a.fontProperties, width_1 = _a.width, height_1 = _a.height, tagName = _a.tagName;
                linePositionX += maxStrokeThickness / 2;
                var linePositionY = maxStrokeThickness / 2 + basePositionY + fontProperties.ascent;
                switch (style.valign) {
                    case "top":
                        // no need to do anything
                        break;
                    case "baseline":
                        linePositionY += lineYMaxs[i] - fontProperties.ascent;
                        break;
                    case "middle":
                        linePositionY += (lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent) / 2;
                        break;
                    case "bottom":
                        linePositionY += lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent;
                        break;
                    default:
                        // A number - offset from baseline, positive is higher
                        linePositionY += lineYMaxs[i] - fontProperties.ascent - style.valign;
                        break;
                }
                if (style.letterSpacing === 0) {
                    drawingData.push({
                        text: text,
                        style: style,
                        x: linePositionX,
                        y: linePositionY,
                        width: width_1,
                        ascent: fontProperties.ascent,
                        descent: fontProperties.descent,
                        tagName: tagName
                    });
                    linePositionX += line[j].width;
                }
                else {
                    this.context.font = this.getFontString(line[j].style);
                    for (var k = 0; k < text.length; k++) {
                        if (k > 0 || j > 0) {
                            linePositionX += style.letterSpacing / 2;
                        }
                        drawingData.push({
                            text: text.charAt(k),
                            style: style,
                            x: linePositionX,
                            y: linePositionY,
                            width: width_1,
                            ascent: fontProperties.ascent,
                            descent: fontProperties.descent,
                            tagName: tagName
                        });
                        linePositionX += this.context.measureText(text.charAt(k)).width;
                        if (k < text.length - 1 || j < line.length - 1) {
                            linePositionX += style.letterSpacing / 2;
                        }
                    }
                }
                linePositionX -= maxStrokeThickness / 2;
            }
            basePositionY += lineYMaxs[i] - lineYMins[i];
        }
        this.context.save();
        // First pass: draw the shadows only
        drawingData.forEach(function (_a) {
            var style = _a.style, text = _a.text, x = _a.x, y = _a.y;
            if (!style.dropShadow) {
                return; // This text doesn't have a shadow
            }
            _this.context.font = _this.getFontString(style);
            var dropFillStyle = style.dropShadowColor;
            if (typeof dropFillStyle === "number") {
                dropFillStyle = PIXI.utils.hex2string(dropFillStyle);
            }
            _this.context.shadowColor = dropFillStyle;
            _this.context.shadowBlur = style.dropShadowBlur;
            _this.context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
            _this.context.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
            _this.context.fillText(text, x, y);
        });
        this.context.restore();
        // Second pass: draw strokes and fills
        drawingData.forEach(function (_a) {
            var style = _a.style, text = _a.text, x = _a.x, y = _a.y, width = _a.width, ascent = _a.ascent, descent = _a.descent, tagName = _a.tagName;
            _this.context.font = _this.getFontString(style);
            var strokeStyle = style.stroke;
            if (typeof strokeStyle === "number") {
                strokeStyle = PIXI.utils.hex2string(strokeStyle);
            }
            _this.context.strokeStyle = strokeStyle;
            _this.context.lineWidth = style.strokeThickness;
            // set canvas text styles
            var fillStyle = style.fill;
            if (typeof fillStyle === "number") {
                fillStyle = PIXI.utils.hex2string(fillStyle);
            }
            else if (Array.isArray(fillStyle)) {
                for (var i = 0; i < fillStyle.length; i++) {
                    var fill = fillStyle[i];
                    if (typeof fill === "number") {
                        fillStyle[i] = PIXI.utils.hex2string(fill);
                    }
                }
            }
            _this.context.fillStyle = _this._generateFillStyle(new PIXI.TextStyle(style), [text]);
            // Typecast required for proper typechecking
            if (style.stroke && style.strokeThickness) {
                _this.context.strokeText(text, x, y);
            }
            if (style.fill) {
                _this.context.fillText(text, x, y);
            }
            var debugSpan = style.debug === undefined
                ? MultiStyleText.debugOptions.spans.enabled
                : style.debug;
            if (debugSpan) {
                _this.context.lineWidth = 1;
                if (MultiStyleText.debugOptions.spans.bounding) {
                    _this.context.fillStyle = MultiStyleText.debugOptions.spans.bounding;
                    _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bounding;
                    _this.context.beginPath();
                    _this.context.rect(x, y - ascent, width, ascent + descent);
                    _this.context.fill();
                    _this.context.stroke();
                    _this.context.stroke(); // yes, twice
                }
                if (MultiStyleText.debugOptions.spans.baseline) {
                    _this.context.strokeStyle = MultiStyleText.debugOptions.spans.baseline;
                    _this.context.beginPath();
                    _this.context.moveTo(x, y);
                    _this.context.lineTo(x + width, y);
                    _this.context.closePath();
                    _this.context.stroke();
                }
                if (MultiStyleText.debugOptions.spans.top) {
                    _this.context.strokeStyle = MultiStyleText.debugOptions.spans.top;
                    _this.context.beginPath();
                    _this.context.moveTo(x, y - ascent);
                    _this.context.lineTo(x + width, y - ascent);
                    _this.context.closePath();
                    _this.context.stroke();
                }
                if (MultiStyleText.debugOptions.spans.bottom) {
                    _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bottom;
                    _this.context.beginPath();
                    _this.context.moveTo(x, y + descent);
                    _this.context.lineTo(x + width, y + descent);
                    _this.context.closePath();
                    _this.context.stroke();
                }
                if (MultiStyleText.debugOptions.spans.text) {
                    _this.context.fillStyle = "#ffffff";
                    _this.context.strokeStyle = "#000000";
                    _this.context.lineWidth = 2;
                    _this.context.font = "8px monospace";
                    _this.context.strokeText(tagName, x, y - ascent + 8);
                    _this.context.fillText(tagName, x, y - ascent + 8);
                    _this.context.strokeText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                    _this.context.fillText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                }
            }
        });
        if (MultiStyleText.debugOptions.objects.enabled) {
            if (MultiStyleText.debugOptions.objects.bounding) {
                this.context.fillStyle = MultiStyleText.debugOptions.objects.bounding;
                this.context.beginPath();
                this.context.rect(0, 0, width, height);
                this.context.fill();
            }
            if (MultiStyleText.debugOptions.objects.text) {
                this.context.fillStyle = "#ffffff";
                this.context.strokeStyle = "#000000";
                this.context.lineWidth = 2;
                this.context.font = "8px monospace";
                this.context.strokeText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                this.context.fillText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
            }
        }
        this.updateTexture();
    };
    MultiStyleText.prototype.wordWrap = function (text) {
        // Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
        var result = '';
        var tags = Object.keys(this.textStyles).join("|");
        var re = new RegExp("(</?(" + tags + ")>)", "g");
        var lines = text.split("\n");
        var wordWrapWidth = this._style.wordWrapWidth;
        var styleStack = [this.assign({}, this.textStyles["default"])];
        this.context.font = this.getFontString(this.textStyles["default"]);
        for (var i = 0; i < lines.length; i++) {
            var spaceLeft = wordWrapWidth;
            var words = lines[i].split(" ");
            for (var j = 0; j < words.length; j++) {
                var parts = words[j].split(re);
                for (var k = 0; k < parts.length; k++) {
                    if (re.test(parts[k])) {
                        result += parts[k];
                        if (parts[k][1] === "/") {
                            k++;
                            styleStack.pop();
                        }
                        else {
                            k++;
                            styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[parts[k]]));
                        }
                        this.context.font = this.getFontString(styleStack[styleStack.length - 1]);
                        continue;
                    }
                    if (parts[k] === "") {
                        continue;
                    }
                    var partWidth = this.context.measureText(parts[k]).width;
                    if (this._style.breakWords && partWidth > spaceLeft) {
                        result += "\n" + parts[k] + " ";
                        spaceLeft = wordWrapWidth - partWidth;
                    }
                    else if (this._style.breakWords) {
                        result += parts[k];
                        spaceLeft -= partWidth;
                    }
                    else {
                        var paddedPartWidth = partWidth + (k === 0 ? this.context.measureText(" ").width : 0);
                        if (j === 0 || paddedPartWidth > spaceLeft) {
                            // Skip printing the newline if it's the first word of the line that is
                            // greater than the word wrap width.
                            if (j > 0) {
                                result += "\n";
                            }
                            result += parts[k];
                            spaceLeft = wordWrapWidth - partWidth;
                        }
                        else {
                            spaceLeft -= paddedPartWidth;
                            result += parts[k];
                        }
                    }
                }
                result = this.checkSpace(result);
            }
            if (i < lines.length - 1) {
                result += '\n';
            }
        }
        return result;
    };
    MultiStyleText.prototype.updateTexture = function () {
        var texture = this._texture;
        var dropShadowPadding = this.getDropShadowPadding();
        texture.baseTexture.hasLoaded = true;
        texture.baseTexture.resolution = this.resolution;
        texture.baseTexture.realWidth = this.canvas.width;
        texture.baseTexture.realHeight = this.canvas.height;
        texture.baseTexture.width = this.canvas.width / this.resolution;
        texture.baseTexture.height = this.canvas.height / this.resolution;
        texture.trim.width = texture.frame.width = this.canvas.width / this.resolution;
        texture.trim.height = texture.frame.height = this.canvas.height / this.resolution;
        texture.trim.x = -this._style.padding - dropShadowPadding;
        texture.trim.y = -this._style.padding - dropShadowPadding;
        texture.orig.width = texture.frame.width - (this._style.padding + dropShadowPadding) * 2;
        texture.orig.height = texture.frame.height - (this._style.padding + dropShadowPadding) * 2;
        // call sprite onTextureUpdate to update scale if _width or _height were set
        this._onTextureUpdate();
        texture.baseTexture.emit('update', texture.baseTexture);
        this.dirty = false;
    };
    // Lazy fill for Object.assign
    MultiStyleText.prototype.assign = function (destination) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
            var source = sources_1[_a];
            for (var key in source) {
                destination[key] = source[key];
            }
        }
        return destination;
    };
    MultiStyleText.DEFAULT_TAG_STYLE = {
        align: "left",
        breakWords: false,
        // debug intentionally not included
        dropShadow: false,
        dropShadowAngle: Math.PI / 6,
        dropShadowBlur: 0,
        dropShadowColor: "#000000",
        dropShadowDistance: 5,
        fill: "black",
        fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
        fontFamily: "Arial",
        fontSize: 26,
        fontStyle: "normal",
        fontVariant: "normal",
        fontWeight: "normal",
        letterSpacing: 0,
        lineHeight: 0,
        lineJoin: "miter",
        miterLimit: 10,
        padding: 0,
        stroke: "black",
        strokeThickness: 0,
        textBaseline: "alphabetic",
        valign: "baseline",
        wordWrap: false,
        wordWrapWidth: 100
    };
    MultiStyleText.debugOptions = {
        spans: {
            enabled: false,
            baseline: "#44BB44",
            top: "#BB4444",
            bottom: "#4444BB",
            bounding: "rgba(255, 255, 255, 0.1)",
            text: true
        },
        objects: {
            enabled: false,
            bounding: "rgba(255, 255, 255, 0.05)",
            text: true
        }
    };
    return MultiStyleText;
}(PIXI.Text));
exports.default = MultiStyleText;
