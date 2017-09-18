interface ExtendedTextStyle extends PIXI.TextStyleOptions {
    valign?: "top" | "middle" | "bottom" | "baseline" | number;
    debug?: boolean;
}
interface TextStyleSet {
    [key: string]: ExtendedTextStyle;
}
interface FontProperties {
    ascent: number;
    descent: number;
    fontSize: number;
}
interface TextData {
    text: string;
    style: ExtendedTextStyle;
    width: number;
    height: number;
    fontProperties: FontProperties;
    tagName: string;
}
interface MstDebugOptions {
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

