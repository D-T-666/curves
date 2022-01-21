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
        
        for (let p = b._anchors.length; p >= 0; p--) {
            for (let q = 0; q < p - 1; q++) {
                a[q] = p5.Vector.lerp(a[q], a[q+1], i / used_resolution);
            }
        }
        
        points.push(a[0].mult(b._size).add(b._pos));
    }

    return points;
}
