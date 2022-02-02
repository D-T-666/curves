import * as p5 from "p5";
import { Bezier } from "../bezier";
import { drawLineCap } from "./lineCaps";
import {
    drawLineSegmentRibbon,
    drawLineSegmentThick,
} from "./lineSegmentWithBorders";
import { getCurve } from "../getCurve";

export interface curveDrawParams {
    _resolution: number;
    _thickness: number;
    _stroke?: Function | p5.Color;
    _fill?: Function | p5.Color;
    _stroke_weight?: Function | number;
    _fill_weight?: Function | number;
    _caps?: number;
    _kind?: "ribbon" | "thick";
}

const getMemoCurve = (p5: p5, b: Bezier, resolution: number): p5.Vector[] => {
    let anchors: p5.Vector[] = b._anchors;

    // Get a floating point number representing the
    // current state of anchors as uniquely as possible
    let curve_hash: number = anchors.reduce(
        (a: number, b: p5.Vector) => a + b.magSq(),
        resolution,
    );

    // Get the curve based on the current and previous
    // curve *hashes*
    let curve: p5.Vector[];
    if (b._p_curve_hash === curve_hash) {
        curve = b._p_curve;
    } else {
        curve = getCurve(p5, anchors, resolution);

        // Updated the previous hash
        b._p_curve = curve;
        b._p_curve_hash = curve_hash;
    }

    // Return the
    return curve;
};

const getDrawFunction = (kind: "ribbon" | "thick"): Function => {
    switch (kind) {
        case "ribbon":
            return drawLineSegmentRibbon;
        case "thick":
            return drawLineSegmentThick;
    }
};

const getDefaultDrawParams = (p5: p5, b: Bezier): curveDrawParams => ({
    _resolution: p5.constrain(b._anchors.length * 5, 25, 100),
    _stroke: p5.color(112, 226, 255, 110),
    _fill: p5.color(112, 226, 255, 110),
    _stroke_weight: 0,
    _fill_weight: 10,
    _caps: 15,
    _thickness: 10,
    _kind: "thick",
});

//
export function drawCurve(
    p5: p5,
    world_transforms: {
        apply: (point: p5.Vector) => p5.Vector;
    },
    b: Bezier,
    _dp?: curveDrawParams,
) {
    const draw_params = _dp ? _dp : getDefaultDrawParams(p5, b);

    const resolution = draw_params._resolution;

    const curve = getMemoCurve(p5, b, resolution).map(world_transforms.apply);

    const draw_line_segment = getDrawFunction(draw_params._kind);

    if (draw_params._caps & 1)
        drawLineCap(
            p5,
            draw_params,
            curve[0],
            curve[1],
            0,
            (draw_params._caps & 4) !== 0,
        );

    for (let i = 0; i < resolution; i++) {
        draw_line_segment(
            p5,
            [
                curve[i - Number(i > 0)],
                curve[i],
                curve[i + 1],
                curve[i + 1 + Number(i < resolution - 1)],
            ],
            draw_params,
            i / resolution,
            (i + 1) / resolution,
        );
    }

    if (draw_params._caps & 2)
        drawLineCap(
            p5,
            draw_params,
            curve[resolution],
            curve[resolution - 1],
            1,
            (draw_params._caps & 8) !== 0,
        );
}
