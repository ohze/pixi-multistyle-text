import * as multitext from "./pixi-multistyle-text"

const MST = multitext.MultiStyleText;

declare module MST {
    export type ExtendedTextStyle = multitext.ExtendedTextStyle;
    export type TextStyleSet = multitext.TextStyleSet;
    export type FontProperties = multitext.FontProperties;
    export type TextData = multitext.TextData;
    export type MstDebugOptions = multitext.MstDebugOptions;
    export type MultiStyleText = multitext.MultiStyleText;
}

export = MST;
