import * as multitext from "./pixi-multistyle-text"

const MultiStyleText = multitext.MultiStyleText;

declare module MultiStyleText {
    export type ExtendedTextStyle = multitext.ExtendedTextStyle;
    export type MstDebugOptions = multitext.MstDebugOptions;
    export type TextStyleSet = multitext.TextStyleSet;
    export type MultiStyleText = multitext.MultiStyleText;
}

export = MultiStyleText;
