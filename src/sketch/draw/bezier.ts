import * as p5 from "p5";
import { Bezier } from "../bezier";
import { drawLineCap } from "./lineCaps";
import { drawLineSegmentWithBorders, drawLineSegmentWithBorders_lines } from "./lineSegmentWithBorders";
import { getCurve } from "../getCurve";

export interface bezierDrawParams {
    _resolution: number,
    _thickness: number,
    _stroke?: Function | p5.Color,
    _fill?: Function | p5.Color,
    _stroke_weight?: Function | number,
    _fill_weight?: Function | number,
    _draw_caps?: number,
}

export const drawBezierCurve = (p: p5, world_transform: any, b: Bezier, kind: string, interaction_vars: any, dp?: bezierDrawParams | boolean) => {
    let used_dp: bezierDrawParams;

    let anchors_to_use: p5.Vector[];

    if (interaction_vars.pmouseIsPressed && interaction_vars.grabbed === 9) {
        anchors_to_use = b._new_anchors;
    } else {
        anchors_to_use = b._anchors;
    }

    if (dp instanceof Object)
        used_dp = dp;
    else if (dp)
        used_dp = b._draw_params;
    else
        used_dp = {
            _resolution: p.constrain(b._anchors.length * 5, 25, 100),
            _stroke: p.color(112, 226, 255, 110),
            _fill: p.color(112, 226, 255, 110),
            _stroke_weight: 0,
            _fill_weight: 10,
            _draw_caps: 15,
            _thickness: 10,
        };
    
    let resolution = used_dp._resolution;

    let curve_hash = anchors_to_use.reduce((a, b) => a + b.magSq(), resolution);
    let curve: p5.Vector[];

    if (b._p_curve_hash === curve_hash) {
        curve = b._p_curve;
    } else {
        curve = getCurve(p, anchors_to_use, resolution, world_transform.apply);

        b._p_curve = curve;
        b._p_curve_hash = anchors_to_use.reduce((a, b) => a + b.magSq(), resolution);
    }

    let line_segment_draw_function: Function;
    switch (kind) {
        case "ribbon":
        case "r":
            line_segment_draw_function = drawLineSegmentWithBorders;
            break;
        case "thick":
        case "t":
            line_segment_draw_function = drawLineSegmentWithBorders_lines;
            used_dp._draw_caps = 15;
            break;
    }

    if (used_dp._draw_caps && used_dp._draw_caps & 1) {
        drawLineCap(p, used_dp, curve[0], curve[1], 0, (used_dp._draw_caps & 4) !== 0);
    }

    for (let i = 0; i < resolution; i++) {
        line_segment_draw_function(p, [
            curve[i - Number(i > 0)], 
            curve[i], 
            curve[i + 1], 
            curve[i + 1 + Number(i < resolution - 1)], 
        ], used_dp, i / (resolution), (i + 1) / (resolution));
    }

    if (used_dp._draw_caps && used_dp._draw_caps & 2)
        drawLineCap(p, used_dp, curve[resolution], curve[resolution - 1], 1, (used_dp._draw_caps & 8) !== 0);
}