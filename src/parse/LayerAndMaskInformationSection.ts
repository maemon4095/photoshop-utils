import { ParseContext } from "~/util/parse/mod.ts";
import { ColorDepth, Version } from "~/parse/FileHeaderSection.ts";
import parseLayerInfo, { LayerInfo } from "~/parse/LayerInfo.ts";
import parseGlobalLayerMaskInfo, { GlobalLayerMaskInfo } from "~/parse/GlobalLayerMaskInfo.ts";
import parseAdditionalLayerInfo, { AdditionalLayerInformation } from "~/parse/AdditionalLayerInformation.gen.ts";

export default function parse(ctx: ParseContext, colorDepth: ColorDepth, version: Version): LayerAndMaskInformationSection | null {
    const sectionLength = (() => {
        switch (version) {
            case Version.PSD:
                return ctx.takeUint32();
            case Version.PSB:
                return Number(ctx.takeUint64());
        }
    })();
    if (sectionLength === 0) {
        return null;
    }
    const start = ctx.byteOffset;
    const layerInfo = parseLayerInfo(ctx, colorDepth, version);
    const globalLayerMaskInfo = parseGlobalLayerMaskInfo(ctx);
    const consumed = ctx.byteOffset - start;
    const additionalLayerInformations: AdditionalLayerInformation[] = [];
    let spaceLeft = sectionLength - consumed;
    while (spaceLeft > 0) {
        const start = ctx.byteOffset;
        const info = parseAdditionalLayerInfo(ctx, version);
        additionalLayerInformations.push(info);
        const consumed = ctx.byteOffset - start;
        spaceLeft -= consumed;
    }

    return { layerInfo, globalLayerMaskInfo, additionalLayerInformations };
}


/** The fourth section of a Photoshop file */
export type LayerAndMaskInformationSection = {
    layerInfo: LayerInfo | null;
    globalLayerMaskInfo: GlobalLayerMaskInfo | null;
    additionalLayerInformations: AdditionalLayerInformation[];
};