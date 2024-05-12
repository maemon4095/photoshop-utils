/*
    this file is generated by source generator.
                DO NOT EDIT.
*/
import { ParseContext } from "~/util/parse/mod.ts";
import { SyntaxError } from "~/parse/SyntaxError.ts";
import { _trie } from "$/tools/GenerateTrie/mod.ts";
import { Version } from "~/parse/FileHeader.ts";
import { parse as parseUnicodeString } from "~/parse/UnicodeString.ts";

export function parse(ctx: ParseContext, version: Version): AdditionalLayerInformation {
    void parseSigneture(ctx);
    const [key, rawKey] = parseKey(ctx);
    const dataSize = parseDataSize(ctx, rawKey, version);
    console.log(dataSize);
    const data = (() => {
        switch (key) {
            case SuportedAdjustmentLayerKey.UnicodeLayerName:
                return parseUnicodeLayerName(ctx);
            case SuportedAdjustmentLayerKey.Unsupported:
                return parseUnsupportedData(ctx, dataSize);
        }
    })();
    return { ...data, rawKey };
}

function parseSigneture(ctx: ParseContext) {
    const bin = ctx.peekUint8Array(4);
    const sig = SignetureTrie.determine(bin);
    if (sig === undefined) {
        throw new InvalidAdditionalLayerSigneture(ctx.byteOffset);
    }
    ctx.advance(bin.byteLength);
}

function parseKey(ctx: ParseContext): [SuportedAdjustmentLayerKey, Uint8Array] {
    const bin = ctx.takeUint8Array(4);
    const key = Trie.determineAdjustmentLayerKey(bin);
    if (key === undefined) {
        console.warn("Unsupported adjustment layer key was detected.");
    }
    return [key ?? SuportedAdjustmentLayerKey.Unsupported, bin];
}

function parseDataSize(ctx: ParseContext, rawKey: Uint8Array, version: Version): number {
    if (version === Version.PSB) {
        if (Trie.lengthDataCouldBeLarge(rawKey)) {
            return Number(ctx.takeUint64());
        }
    }
    return ctx.takeUint32();
}

function parseUnicodeLayerName(ctx: ParseContext): UnicodeLayerName {
    const name = parseUnicodeString(ctx);
    return { key: SuportedAdjustmentLayerKey.UnicodeLayerName, name };
}

function parseUnsupportedData(ctx: ParseContext, size: number): UnsupportedData {
    const data = ctx.takeUint8Array(size);
    return { key: SuportedAdjustmentLayerKey.Unsupported, data };
}

type AdjustmentLayerKeyMap = {
    [SuportedAdjustmentLayerKey.Unsupported]: UnsupportedData;
    [SuportedAdjustmentLayerKey.UnicodeLayerName]: UnicodeLayerName;
};

export type AdditionalLayerInformation = { rawKey: Uint8Array; } & AdjustmentLayerKeyMap[SuportedAdjustmentLayerKey];

export enum SuportedAdjustmentLayerKey {
    Unsupported,
    UnicodeLayerName,
}

export type UnsupportedData = {
    key: SuportedAdjustmentLayerKey.Unsupported;
    data: Uint8Array;
};

export type UnicodeLayerName = {
    key: SuportedAdjustmentLayerKey.UnicodeLayerName;
    name: string;
};

export class InvalidAdditionalLayerSigneture extends SyntaxError {
    constructor(byteOffset: number) {
        super(byteOffset);
        this.message = "Additional layer signeture must be `8BIM` or `8B64`.";
    }
}

class SignetureTrie {static determine(_array: Uint8Array): number | undefined { return ((_) => {switch(_[0]){case 56:switch(_[1]){case 66:switch(_[2]){case 73:switch(_[3]){case 77:return 0;default:return undefined;}case 54:switch(_[3]){case 52:return 1;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }
}

class Trie {static determineAdjustmentLayerKey(_array: Uint8Array): SuportedAdjustmentLayerKey | undefined { return ((_) => {switch(_[0]){case 108:switch(_[1]){case 117:switch(_[2]){case 110:switch(_[3]){case 105:return SuportedAdjustmentLayerKey.UnicodeLayerName;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }static lengthDataCouldBeLarge(_array: Uint8Array): boolean | undefined { return ((_) => {switch(_[0]){case 76:switch(_[1]){case 77:switch(_[2]){case 115:switch(_[3]){case 107:return true;default:return undefined;}default:return undefined;}case 114:switch(_[2]){case 49:switch(_[3]){case 54:return true;default:return undefined;}case 51:switch(_[3]){case 50:return true;default:return undefined;}default:return undefined;}case 97:switch(_[2]){case 121:switch(_[3]){case 114:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 77:switch(_[1]){case 116:switch(_[2]){case 49:switch(_[3]){case 54:return true;default:return undefined;}case 51:switch(_[3]){case 50:return true;default:return undefined;}case 114:switch(_[3]){case 110:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 65:switch(_[1]){case 108:switch(_[2]){case 112:switch(_[3]){case 104:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 70:switch(_[1]){case 77:switch(_[2]){case 115:switch(_[3]){case 107:return true;default:return undefined;}default:return undefined;}case 69:switch(_[2]){case 105:switch(_[3]){case 100:return true;default:return undefined;}default:return undefined;}case 88:switch(_[2]){case 105:switch(_[3]){case 100:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 108:switch(_[1]){case 110:switch(_[2]){case 107:switch(_[3]){case 50:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 80:switch(_[1]){case 120:switch(_[2]){case 83:switch(_[3]){case 68:return true;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }
}

