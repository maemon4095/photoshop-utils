/*
    this file is generated by source generator.
                DO NOT EDIT.
*/
import { ParseContext } from "~/util/parse/mod.ts";
import { _trie } from "$/tools/GenerateTrie/mod.ts";
import { SyntaxError } from "~/parse/SyntaxError.ts";

export function parse(ctx: ParseContext): [SupportedBlendMode, Uint8Array] {
    const bin = ctx.takeUint8Array(4);
    const mode = Trie.determine(bin);
    if (mode === undefined) {
        console.warn("Unsupported blend mode was detected.");
    }
    return [mode ?? SupportedBlendMode.Unsupported, bin];
}
class Trie {static determine(_seq: Uint8Array): undefined | SupportedBlendMode { return ((_) => {switch(_[0]){case 112:switch(_[1]){case 97:switch(_[2]){case 115:switch(_[3]){case 115:return SupportedBlendMode.PassThrough;default:return undefined;}default:return undefined;}case 76:switch(_[2]){case 105:switch(_[3]){case 116:return SupportedBlendMode.PinLight;default:return undefined;}default:return undefined;}default:return undefined;}case 110:switch(_[1]){case 111:switch(_[2]){case 114:switch(_[3]){case 109:return SupportedBlendMode.Normal;default:return undefined;}default:return undefined;}default:return undefined;}case 100:switch(_[1]){case 105:switch(_[2]){case 115:switch(_[3]){case 115:return SupportedBlendMode.Dissolve;default:return undefined;}case 118:switch(_[3]){case 32:return SupportedBlendMode.ColorDodge;default:return undefined;}case 102:switch(_[3]){case 102:return SupportedBlendMode.Difference;default:return undefined;}default:return undefined;}case 97:switch(_[2]){case 114:switch(_[3]){case 107:return SupportedBlendMode.Darken;default:return undefined;}default:return undefined;}case 107:switch(_[2]){case 67:switch(_[3]){case 108:return SupportedBlendMode.DarkerColor;default:return undefined;}default:return undefined;}default:return undefined;}case 109:switch(_[1]){case 117:switch(_[2]){case 108:switch(_[3]){case 32:return SupportedBlendMode.Multiply;default:return undefined;}default:return undefined;}default:return undefined;}case 105:switch(_[1]){case 100:switch(_[2]){case 105:switch(_[3]){case 118:return SupportedBlendMode.ColorBurn;default:return undefined;}default:return undefined;}default:return undefined;}case 108:switch(_[1]){case 98:switch(_[2]){case 114:switch(_[3]){case 110:return SupportedBlendMode.LinearBurn;default:return undefined;}default:return undefined;}case 105:switch(_[2]){case 116:switch(_[3]){case 101:return SupportedBlendMode.Lighten;default:return undefined;}default:return undefined;}case 100:switch(_[2]){case 100:switch(_[3]){case 103:return SupportedBlendMode.LinearDodge;default:return undefined;}default:return undefined;}case 103:switch(_[2]){case 67:switch(_[3]){case 108:return SupportedBlendMode.LighterColor;default:return undefined;}default:return undefined;}case 76:switch(_[2]){case 105:switch(_[3]){case 116:return SupportedBlendMode.LinearLight;default:return undefined;}default:return undefined;}case 117:switch(_[2]){case 109:switch(_[3]){case 32:return SupportedBlendMode.Luminosity;default:return undefined;}default:return undefined;}default:return undefined;}case 115:switch(_[1]){case 99:switch(_[2]){case 114:switch(_[3]){case 110:return SupportedBlendMode.Screen;default:return undefined;}default:return undefined;}case 76:switch(_[2]){case 105:switch(_[3]){case 116:return SupportedBlendMode.SoftLight;default:return undefined;}default:return undefined;}case 109:switch(_[2]){case 117:switch(_[3]){case 100:return SupportedBlendMode.Exclusion;default:return undefined;}default:return undefined;}case 97:switch(_[2]){case 116:switch(_[3]){case 32:return SupportedBlendMode.Saturation;default:return undefined;}default:return undefined;}default:return undefined;}case 111:switch(_[1]){case 118:switch(_[2]){case 101:switch(_[3]){case 114:return SupportedBlendMode.Overlay;default:return undefined;}default:return undefined;}default:return undefined;}case 104:switch(_[1]){case 76:switch(_[2]){case 105:switch(_[3]){case 116:return SupportedBlendMode.HardLight;default:return undefined;}default:return undefined;}case 77:switch(_[2]){case 105:switch(_[3]){case 120:return SupportedBlendMode.HardMix;default:return undefined;}default:return undefined;}case 117:switch(_[2]){case 101:switch(_[3]){case 32:return SupportedBlendMode.Hue;default:return undefined;}default:return undefined;}default:return undefined;}case 118:switch(_[1]){case 76:switch(_[2]){case 105:switch(_[3]){case 116:return SupportedBlendMode.VividLight;default:return undefined;}default:return undefined;}default:return undefined;}case 102:switch(_[1]){case 115:switch(_[2]){case 117:switch(_[3]){case 98:return SupportedBlendMode.Subtract;default:return undefined;}default:return undefined;}case 100:switch(_[2]){case 105:switch(_[3]){case 118:return SupportedBlendMode.Divide;default:return undefined;}default:return undefined;}default:return undefined;}case 99:switch(_[1]){case 111:switch(_[2]){case 108:switch(_[3]){case 114:return SupportedBlendMode.Color;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_seq); }
}

export enum SupportedBlendMode {
    Unsupported,
    PassThrough,
    Normal,
    Dissolve,
    Darken,
    Multiply,
    ColorBurn,
    LinearBurn,
    DarkerColor,
    Lighten,
    Screen,
    ColorDodge,
    LinearDodge,
    LighterColor,
    Overlay,
    SoftLight,
    HardLight,
    VividLight,
    LinearLight,
    PinLight,
    HardMix,
    Difference,
    Exclusion,
    Subtract,
    Divide,
    Hue,
    Saturation,
    Color,
    Luminosity,
}


export class InvalidBlendModeError extends SyntaxError {
    constructor(offset: number) {
        super(offset);
        this.message = "Unexpected blend mode value.";
    }
}