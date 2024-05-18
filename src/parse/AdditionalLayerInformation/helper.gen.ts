/*
    this file is generated by source generator.
                DO NOT EDIT.
*/
import { _trie } from "$/tools/GenerateTrie/mod.ts";
import { AdjustmentLayerKey } from "~/parse/AdditionalLayerInformation/mod.ts";

export enum Signeture {
    _8BIM,
    _8B64
}

export class Determine {static signeture(_array: Uint8Array): Signeture | undefined { return ((_) => {switch(_[0]){case 56:switch(_[1]){case 66:switch(_[2]){case 73:switch(_[3]){case 77:return Signeture._8BIM;default:return undefined;}case 54:switch(_[3]){case 52:return Signeture._8B64;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }static lengthDataCouldBeLarge(_array: Uint8Array): boolean | undefined { return ((_) => {switch(_[0]){case 76:switch(_[1]){case 77:switch(_[2]){case 115:switch(_[3]){case 107:return true;default:return undefined;}default:return undefined;}case 114:switch(_[2]){case 49:switch(_[3]){case 54:return true;default:return undefined;}case 51:switch(_[3]){case 50:return true;default:return undefined;}default:return undefined;}case 97:switch(_[2]){case 121:switch(_[3]){case 114:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 77:switch(_[1]){case 116:switch(_[2]){case 49:switch(_[3]){case 54:return true;default:return undefined;}case 51:switch(_[3]){case 50:return true;default:return undefined;}case 114:switch(_[3]){case 110:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 65:switch(_[1]){case 108:switch(_[2]){case 112:switch(_[3]){case 104:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 70:switch(_[1]){case 77:switch(_[2]){case 115:switch(_[3]){case 107:return true;default:return undefined;}default:return undefined;}case 69:switch(_[2]){case 105:switch(_[3]){case 100:return true;default:return undefined;}default:return undefined;}case 88:switch(_[2]){case 105:switch(_[3]){case 100:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 108:switch(_[1]){case 110:switch(_[2]){case 107:switch(_[3]){case 50:return true;default:return undefined;}default:return undefined;}default:return undefined;}case 80:switch(_[1]){case 120:switch(_[2]){case 83:switch(_[3]){case 68:return true;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }static adjustmentLayerKey(_array: Uint8Array): AdjustmentLayerKey | undefined { return ((_) => {switch(_[0]){case 108:switch(_[1]){case 117:switch(_[2]){case 110:switch(_[3]){case 105:return AdjustmentLayerKey.UnicodeLayerName;default:return undefined;}default:return undefined;}case 121:switch(_[2]){case 105:switch(_[3]){case 100:return AdjustmentLayerKey.LayerId;default:return undefined;}default:return undefined;}case 115:switch(_[2]){case 112:switch(_[3]){case 102:return AdjustmentLayerKey.ProtectedSetting;default:return undefined;}case 99:switch(_[3]){case 116:return AdjustmentLayerKey.SectionDividerSetting;default:return undefined;}default:return undefined;}case 99:switch(_[2]){case 108:switch(_[3]){case 114:return AdjustmentLayerKey.SheetColorSetting;default:return undefined;}default:return undefined;}default:return undefined;}case 99:switch(_[1]){case 108:switch(_[2]){case 98:switch(_[3]){case 108:return AdjustmentLayerKey.BlendClippingElements;default:return undefined;}default:return undefined;}default:return undefined;}case 105:switch(_[1]){case 110:switch(_[2]){case 102:switch(_[3]){case 120:return AdjustmentLayerKey.BlendInteriorElements;default:return undefined;}default:return undefined;}default:return undefined;}case 107:switch(_[1]){case 110:switch(_[2]){case 107:switch(_[3]){case 111:return AdjustmentLayerKey.KnockoutSetting;default:return undefined;}default:return undefined;}default:return undefined;}default:return undefined;}})(_array); }
}