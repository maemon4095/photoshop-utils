import { ParseOptions, PhotoshopFile } from "~/parse/mod.ts";
import { ClippingMode, LayerRecords } from "~/parse/LayerRecords.ts";
import { ImageChannel } from "~/parse/ImageChannel.ts";
import { AdjustmentLayerKey } from "~/parse/AdditionalLayerInformation/mod.ts";
import { decode as decodeText } from "~/util/encoding/mod.ts";
import { SectionDividerSetting, SectionDividerType } from "~/parse/AdditionalLayerInformation/SectionDividerSetting.ts";
import { ImageResourceBlock } from "~/parse/ImageResourceBlock.ts";
import { ColorDepth, ColorMode, Version } from "~/parse/FileHeaderSection.ts";
import { AdditionalLayerInformation } from "~/parse/AdditionalLayerInformation/mod.ts";
import { GlobalLayerMaskInfo } from "~/parse/GlobalLayerMaskInfo.ts";
import { LayerFlags } from "~/parse/LayerRecords.ts";
import { BlendMode } from "~/parse/BlendMode.gen.ts";
import parsePhotoshop from "~/parse/mod.ts";
import { ImageDataCompression } from "~/parse/ImageCompression.ts";
import { decodeLayer } from "~/decoding/mod.ts";
export type { Rectangle } from "~/parse/Rectangle.ts";
export type { ClippingMode } from "~/parse/LayerRecords.ts";
export type { LayerBlendingRanges } from "~/parse/LayerBlendingRanges.ts";


export type PhotoshopStrucuture = {
    type: "Photoshop",
    height: number;
    width: number;
    channelCount: number;
    colorDepth: ColorDepth;
    colorMode: ColorMode;
    version: Version;
    colorModeData: Uint8Array;
    imageResources: ImageResources;
    imageData: PhotoshopImageData | null;
    roots: (Group | Layer)[];
    /** all layers in top to bottom order. */
    layers: Layer[];
    additionalLayerInformations: AdditionalLayerInformation[];
    globalLayerMaskInfo: GlobalLayerMaskInfo | null;
};

export type PhotoshopImageData = {
    compression: ImageDataCompression;
    data: Uint8Array;
};
export type ImageResources = {
    blocks: ImageResourceBlock[];
};

const END_OF_GROUP = Symbol();

export function parse(buffer: ArrayBuffer, options?: ParseOptions): PhotoshopStrucuture {
    const file = parsePhotoshop(buffer, options);
    return constructPhotoshopStructureFrom(file);
}

export function constructPhotoshopStructureFrom(file: PhotoshopFile): PhotoshopStrucuture {
    const colorModeData = file.colorModeData.data;
    const { height, width, channelCount, colorDepth, colorMode, version } = file.fileHeader;
    const imageData: PhotoshopImageData | null = file.imageDataSection;
    const blocks = file.imageResources.blocks;
    const layerRecords = file.layerAndMaskInformation.layerInfo?.layerRecords ?? [];
    const perLayerImages = file.layerAndMaskInformation.layerInfo?.perLayerChannels ?? [];
    const { roots, layers } = collectRoots(file, layerRecords, perLayerImages);
    const { additionalLayerInformations, globalLayerMaskInfo } = file.layerAndMaskInformation;
    const psd = {
        type: "Photoshop",
        width, height, channelCount, colorDepth, colorMode, version,
        colorModeData,
        imageData,
        imageResources: { blocks },
        roots,
        layers,
        additionalLayerInformations,
        globalLayerMaskInfo
    } as PhotoshopStrucuture;

    for (let i = 0; i < roots.length; ++i) {
        roots[i].parent = psd;
    }

    return psd;
}

export function getPhotoshop(node: Layer | Group | PhotoshopStrucuture): PhotoshopStrucuture {
    while (node.type !== "Photoshop") {
        node = node.parent;
    }
    return node;
}

type Optional<T, K extends keyof T> = Omit<T, K> & { [p in K]?: T[p] };

function collectRoots(file: PhotoshopFile, layerRecords: LayerRecords[], perLayerChannels: ImageChannel[][]): {
    roots: (Optional<Group, "parent"> | Optional<Layer, "parent">)[];
    layers: Layer[];
} {
    // layer は最も背面から並んでいるため、最上面からに並び替え。
    layerRecords = layerRecords.toReversed();
    perLayerChannels = perLayerChannels.toReversed();
    const layers: Layer[] = [];
    const roots: (Optional<Group, "parent"> | Optional<Layer, "parent">)[] = [];
    const groupStack: Optional<Group, "parent">[] = [];

    for (let i = 0; i < layerRecords.length; ++i) {
        const node = processRecord(file, layerRecords[i], perLayerChannels[i]);

        if (node === END_OF_GROUP) {
            const group = groupStack.pop()!;
            const parent = groupStack[0];
            if (parent === undefined) {
                roots.push(group);
            } else {
                group.parent = parent as Group;
                parent.children.push(group as Group);
            }
            continue;
        }

        if (node.type === "Layer") {
            const parent = groupStack[groupStack.length - 1];
            if (parent === undefined) {
                roots.push(node);
            } else {
                node.parent = parent as Group;
                parent.children.push(node as Layer);
            }
            layers.push(node as Layer);
        } else {
            groupStack.push(node);
        }
    }
    if (groupStack.length !== 0) {
        console.warn("group does not closed properly.");

        const g = groupStack.reduceRight((r, l) => {
            l.children.push(r as Group);
            return l;
        });

        roots.push(g);
    }

    return { roots, layers };
}

function processRecord(file: PhotoshopFile, records: LayerRecords, channels: ImageChannel[]): Optional<Layer, "parent"> | Optional<Group, "parent"> | typeof END_OF_GROUP {
    let name: string | null = null;
    let dividerSettings: SectionDividerSetting | null = null;
    for (const info of records.additionalLayerInformations) {
        switch (info.key) {
            case AdjustmentLayerKey.Unknown:
                continue;
            case AdjustmentLayerKey.UnicodeLayerName: {
                name = info.name;
                break;
            }
            case AdjustmentLayerKey.SectionDividerSetting: {
                dividerSettings = info;
                break;
            }
            default: break;
        }
    }

    if (name === null) {
        name = decodeText(records.layerName);
    }
    const imageData = decodeLayer(file, records, channels);
    const layerProps: Omit<LayerProperties, "parent"> = {
        name,
        imageData,
        opacity: records.opacity,
        blendMode: records.blendMode,
        clippingMode: records.clippingMode,
        visible: (records.layerFlags & LayerFlags.Visible) === LayerFlags.Visible,
        additionalInformations: records.additionalLayerInformations,
        ...records.enclosingRectangle,
    };
    if (dividerSettings === null || dividerSettings.type === SectionDividerType.Other) {
        return {
            type: "Layer",
            ...layerProps
        };
    }
    if (dividerSettings.type === SectionDividerType.BoundingSectionDivider) {
        return END_OF_GROUP;
    }

    // group's blend mode seems to be always BlendMode.Normal
    // Therefore override blend mode if set
    if (dividerSettings.blendMode !== undefined) {
        layerProps.blendMode = dividerSettings.blendMode;
    }
    return {
        type: "Group",
        isOpen: dividerSettings.type === SectionDividerType.OpenFolder,
        children: [],
        ...layerProps,
    };
}

export type LayerProperties = {
    name: string;
    visible: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    /** 0 = transparent, 255 = opaque. */
    opacity: number;
    clippingMode: ClippingMode,
    blendMode: BlendMode;
    imageData: null | ImageData,
    parent: Group | PhotoshopStrucuture;
    additionalInformations: AdditionalLayerInformation[];
};

export type Layer = {
    type: "Layer";
} & LayerProperties;

export type Group = {
    type: "Group";
    isOpen: boolean;
    children: (Layer | Group)[];
} & LayerProperties;

export { Version, BlendMode, ColorMode };

export type {
    ImageChannel,
    AdjustmentLayerKey,
    ImageDataCompression, ImageResourceBlock,
    ColorDepth,
    AdditionalLayerInformation,
    ParseOptions
};

