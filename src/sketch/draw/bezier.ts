import * as p5 from "p5";
import { Bezier } from "../bezier";
import { drawLineCap } from "./lineCaps";
import { drawLineSegmentWithBorders } from "./lineSegmentWithBorders";
import { getCurve } from "../getCurve";

export interface bezierDrawParams {
    _resolution: number,
    _stroke?: Function | p5.Color,
    _fill?: Function | p5.Color,
    _stroke_weight?: Function | number,
    _fill_weight?: Function | number,
    _draw_caps?: number,
}

export const drawBezierCurve = (p: p5, b: Bezier, interaction_vars: any, dp?: bezierDrawParams | boolean) => {
    let used_dp: bezierDrawParams;

    let anchors_to_use: p5.Vector[];
    let offset_to_use: p5.Vector

    if (interaction_vars.pmouseIsPressed && interaction_vars.grabbed === 9) {
        anchors_to_use = b._new_anchors;
        offset_to_use = b._new_pos;
    } else {
        anchors_to_use = b._anchors;
        offset_to_use = b._pos;
    }

    if (dp instanceof Object)
        used_dp = dp;
    else if (dp)
        used_dp = b._draw_params;
    else
        used_dp = {
            _resolution: 25,
            _stroke: p.color(112, 226, 255, 110),
            _fill: p.color(112, 226, 255, 110),
            _stroke_weight: 2,
            _fill_weight: 10,
            _draw_caps: 15
        };
    
    let resolution = used_dp._resolution;

    let curve = getCurve(p, anchors_to_use, resolution, {
        offset: offset_to_use,
        scale: b._size
    });

    if (used_dp._draw_caps && used_dp._draw_caps & 1) {
        drawLineCap(p, used_dp, curve[0], curve[1], 0, (used_dp._draw_caps & 4) !== 0);
    }

    for (let i = 0; i < resolution; i++) {
        drawLineSegmentWithBorders(p, [
            curve[i - Number(i > 0)], 
            curve[i], 
            curve[i + 1], 
            curve[i + 1 + Number(i < resolution - 1)], 
        ], used_dp, i / (resolution), (i + 1) / (resolution));
    }

    if (used_dp._draw_caps && used_dp._draw_caps & 2)
        drawLineCap(p, used_dp, curve[resolution], curve[resolution - 1], 1, (used_dp._draw_caps & 8) !== 0);
}