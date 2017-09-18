declare class MultiStyleText extends PIXI.Text {
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
    protected updateTexture(): void;
    private assign(destination, ...sources);
}
