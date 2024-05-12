import { ParseContext, measured } from "~/util/parse/mod.ts";
import { parse as parseBlock, ImageResourceBlock } from "~/parse/ImageResourceBlock.ts";
import { SyntaxError } from "~/parse/SyntaxError.ts";

export function parse(ctx: ParseContext): ImageResources {
    let rest = ctx.takeUint32();
    const blocks: ImageResourceBlock[] = [];
    const measuredParseBlock = measured(parseBlock);
    while (rest > 0) {
        const [block, consumed] = measuredParseBlock(ctx);
        blocks.push(block);
        rest -= consumed;
    }
    if (rest !== 0) {
        throw new InvalidImageResourceBlockOverflowError(ctx.byteOffset);
    }

    return { blocks };
}

/** The third section of Photoshop file */
export type ImageResources = {
    blocks: ImageResourceBlock[];
};

export class InvalidImageResourceBlockOverflowError extends SyntaxError {
    constructor(offset: number) {
        super(offset);
        this.message = "Image resource block overflows image resource section.";
    }
}
