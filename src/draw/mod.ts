import { Photoshop } from "../structure/mod.ts";
import { Blender } from "jsr:@maemon4095/imagedata-blender-gl@0.1";
import { blendLayerTo, Request, Response } from "./util.ts";
import createRenderWorker from "./render.worker.gen.ts";
import { isLayerVisible } from "./util.ts";

export function blendTo(blender: Blender, ps: Photoshop, dx: number, dy: number) {
    const layers = ps.layers;
    // FIXME: クリッピングには直前のレイヤのみ影響すべき
    // FIXME: クリッピングされるレイヤは、クリッピングレイヤが不可視のときは非表示になるべき
    for (let i = layers.length - 1; i >= 0; --i) {
        blendLayerTo(blender, layers[i], dx, dy);
    }
}

export function renderSync(ps: Photoshop): ImageData {
    const blender = new Blender(ps.width, ps.height);
    blendTo(blender, ps, 0, 0);
    const image = blender.createImageData();
    blender.cleanUp();
    return image;
}

export async function render(ps: Photoshop): Promise<ImageData> {
    const worker = createRenderWorker();
    const data = await new Promise<ImageData>(resolve => {
        worker.onmessage = (e: MessageEvent<Response>) => {
            switch (e.data.type) {
                case "done": {
                    resolve(e.data.data);
                    break;
                }
            }
        };
        worker.postMessage({ type: "init", width: ps.width, height: ps.height } satisfies Request);
        const layers = ps.layers;
        for (let i = layers.length - 1; i >= 0; --i) {
            const layer = layers[i];
            if (!isLayerVisible(layer)) continue;

            worker.postMessage({ type: "blend", layer } satisfies Request);
        }
        worker.postMessage({ type: "complete" } satisfies Request);
    });
    console.log(data);
    return data;
}