import { bezierDrawParams } from "./bezier";

export const drawLineCap = (p: p5, dp: bezierDrawParams, p1: p5.Vector, p2: p5.Vector, t: number, rounded: boolean) => {
    // Get the fill weight
    let fw = dp._fill_weight instanceof Function ? dp._fill_weight(t) : dp._fill_weight;

    // If necessary variables for stroke are present
    if (dp._stroke_weight && dp._stroke) {
        // Get the stroke color
        let s = dp._stroke instanceof Function ? dp._stroke(t) : dp._stroke;
        // Get the stroke weight
        let sw = dp._stroke_weight instanceof Function ? dp._stroke_weight(t) : dp._stroke_weight
        // If the weight, 
        if (sw > 0 && p.alpha(s) !== 0 && (fw > 0)) {
            p.stroke(s);
            p.strokeWeight(sw);
        } else {
            p.noStroke();
        }
    } else {
        p.noStroke();
    }

    if (rounded) {
        // Set fill 
        if (dp._fill)
            p.fill(dp._fill instanceof Function ? dp._fill(t) : dp._fill);
        else
            p.noFill();

        // Get the mid-angle (radians) of the curve
        const a = p2.copy().sub(p1).normalize().heading();

        p.arc(p1.x, p1.y, fw, fw, a + p.HALF_PI, a - p.HALF_PI);
    } else {
        let d = p1.copy().sub(p2).normalize();

        let l = d.copy().rotate(p.HALF_PI).mult(fw / 2);
        let r = l.copy().mult(-1);

        let sw = dp._stroke_weight instanceof Function ? dp._stroke_weight(t) : dp._stroke_weight
        d.mult(sw);

        l.add(p1).add(d); r.add(p1).add(d);

        p.line(l.x, l.y, r.x, r.y);
    }
};