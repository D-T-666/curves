import * as p5 from "p5";
import { Bezier } from "./bezier";

export const getCurve = (p: p5, anchors: p5.Vector[], resolution: number, transform?: {offset: p5.Vector, scale: number}): p5.Vector[] => {
    let points: p5.Vector[] = [];

    let used_resolution: number;
    used_resolution = resolution;

    for (let i = 0; i < used_resolution + 1; i++) {
        let a = [...anchors];
        
        for (let j = anchors.length; j >= 0; j--) {
            for (let q = 0; q < j - 1; q++) {
                a[q] = p.createVector(p.lerp(a[q].x, a[q+1].x, i / used_resolution), p.lerp(a[q].y, a[q+1].y, i / used_resolution));
            }
        }
        
        if (transform)
            points.push(a[0].mult(transform.scale).add(transform.offset));
        else
            points.push(a[0]);
    }

    return points;
}
