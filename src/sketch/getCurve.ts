import * as p5 from "p5";
import { Bezier } from "./bezier";

export const getCurve = (p: p5, b: Bezier, resolution?: number): p5.Vector[] => {
    let points: p5.Vector[] = [];

    let used_resolution: number;
    if (resolution)
        used_resolution = resolution;
    else
        used_resolution = b._draw_params._resolution;

    for (let i = 0; i < used_resolution + 1; i++) {
        let a = [...b._anchors];
        
        for (let j = b._anchors.length; j >= 0; j--) {
            for (let q = 0; q < j - 1; q++) {
                a[q] = p.createVector(p.lerp(a[q].x, a[q+1].x, i / used_resolution), p.lerp(a[q].y, a[q+1].y, i / used_resolution));
            }
        }
        
        points.push(a[0].mult(b._size).add(b._pos));
    }

    return points;
}
