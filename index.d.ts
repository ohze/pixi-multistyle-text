/// <reference types="pixi.js" />
export interface ExtendedTextStyle extends PIXI.TextStyleOptions {
    valign?: "top" | "middle" | "bottom" | "baseline" | number;
    debug?: boolean;
}
export interface TextStyleSet {
    [key: string]: ExtendedTextStyle;
}
export interface FontProperties {
    ascent: number;
    descent: number;
    fontSize: number;
}
export interface TextData {
    text: string;
    style: ExtendedTextStyle;
    width: number;
    height: number;
    fontProperties: FontProperties;
    tagName: string;
}
export interface MstDebugOptions {
    spans: {
        enabled?: boolean;
        baseline?: string;
        top?: string;
        bottom?: string;
        bounding?: string;
        text?: boolean;
    };
    objects: {
        enabled?: boolean;
        bounding?: string;
        text?: boolean;
    };
}
export default class MultiStyleText extends PIXI.Text {
    private static DEFAULT_TAG_STYLE;
    static debugOptions: MstDebugOptions;
    protected textStyles: TextStyleSet;
    constructor(text?: string, styles?: TextStyleSet);
    styles: TextStyleSet;
    setTagStyle(tag: string, style: ExtendedTextStyle): void;
    deleteTagStyle(tag: string): void;
    protected _getTextDataPerLine(lines: string[]): TextData[][];
    protected getFontString(style: ExtendedTextStyle): string;
    protected createTextData(text: string, style: ExtendedTextStyle, tagName: string): TextData;
    protected getDropShadowPadding(): number;
    updateText(): void;
    protected wordWrap(text: string): string;
    private sliceString;
    protected checkSpace: (result: string) => string;
    protected updateTexture(): void;
    private assign(destination, ...sources);
}
