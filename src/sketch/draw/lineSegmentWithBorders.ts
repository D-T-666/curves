import { curveDrawParams } from "./curve";

export const drawLineSegmentRibbon = (
    p: p5,
    ps: p5.Vector[],
    dp: curveDrawParams,
    t1: number,
    t2: number,
) => {
    // Pre-defining some variables for later use
    let d1: p5.Vector, d2: p5.Vector;
    let l1: p5.Vector, l2: p5.Vector;
    let r1: p5.Vector, r2: p5.Vector;

    // Get the tangent vectors of the points
    d1 = ps[0].copy().sub(ps[2]).normalize();
    d2 = ps[1].copy().sub(ps[3]).normalize();

    // Get the normal vectors poinitng to right and left at each end
    l1 = d1.copy().rotate(p.HALF_PI);
    r1 = l1.copy().mult(-1);

    l2 = d2.copy().rotate(p.HALF_PI);
    r2 = l2.copy().mult(-1);

    // Scale the tangent vectors by halves to later use them
    // for overlaping line segments with half a pixel each
    d1.mult(0.5);
    d2.mult(-0.5);

    // Get the fill weights at each end of the line segment
    let fw1 =
        dp._fill_weight instanceof Function
            ? dp._fill_weight(t1)
            : dp._fill_weight;
    let fw2 =
        dp._fill_weight instanceof Function
            ? dp._fill_weight(t2)
            : dp._fill_weight;

    // Scale and transform the vectors accordingly:
    //   normalized * the length it should have + the
    //   offset (the position of the ends of the line
    //   segment) + that half pixel adjustment
    l1.mult(fw1 / 2)
        .add(ps[1])
        .add(d1);
    r1.mult(fw1 / 2)
        .add(ps[1])
        .add(d1);
    l2.mult(fw2 / 2)
        .add(ps[2])
        .add(d2);
    r2.mult(fw2 / 2)
        .add(ps[2])
        .add(d2);

    // If the necessary variables for fill are present
    if (dp._fill && dp._fill_weight) {
        // Get the fill color
        let f = dp._fill instanceof Function ? dp._fill(t1) : dp._fill;

        // If the alpha is non-zero and at least one of
        // the fill weights is greater than zero
        if (p.alpha(f) !== 0 && (fw1 > 0 || fw2 > 0)) {
            p.fill(f);
            p.noStroke();

            p.beginShape();
            {
                p.vertex(l1.x, l1.y);
                p.vertex(l2.x, l2.y);
                p.vertex(r2.x, r2.y);
                p.vertex(r1.x, r1.y);
            }
            p.endShape();
        }
    }

    // If variables necessary for stroke are present
    if (dp._stroke_weight && dp._stroke) {
        // Get the stroke color and weight
        let s = dp._stroke instanceof Function ? dp._stroke(t1) : dp._stroke;
        let sw =
            dp._stroke_weight instanceof Function
                ? dp._stroke_weight(t1)
                : dp._stroke_weight;

        // If stroke weight is greater than zero, the alpha of
        // the stroke is greater than zero, and at least one
        // of the fill weights is greater than zero
        if (sw > 0 && p.alpha(s) !== 0 && (fw1 > 0 || fw2 > 0)) {
            p.stroke(s);
            p.strokeWeight(sw);

            p.line(l1.x, l1.y, l2.x, l2.y);
            p.line(r1.x, r1.y, r2.x, r2.y);
        }
    }
};

export const drawLineSegmentThick = (
    p: p5,
    ps: p5.Vector[],
    dp: curveDrawParams,
    t1: number,
    t2: number,
) => {
    // Pre-defining some variables for later use
    let d1: p5.Vector, d2: p5.Vector;
    let l1: p5.Vector, l2: p5.Vector;
    let r1: p5.Vector, r2: p5.Vector;

    // Get the tangent vectors of the points
    d1 = ps[0].copy().sub(ps[2]).normalize();
    d2 = ps[1].copy().sub(ps[3]).normalize();

    // Get the normal vectors poinitng to right and left at each end
    l1 = d1.copy().rotate(p.HALF_PI);
    r1 = l1.copy().mult(-1);

    l2 = d2.copy().rotate(p.HALF_PI);
    r2 = l2.copy().mult(-1);

    // Scale the tangent vectors by halves to later use them
    // for overlaping line segments with half a pixel each
    d1.mult(0.5);
    d2.mult(-0.5);

    // Get the fill weights at each end of the line segment
    let fw1 =
        dp._fill_weight instanceof Function
            ? dp._fill_weight(t1)
            : dp._fill_weight;
    let fw2 =
        dp._fill_weight instanceof Function
            ? dp._fill_weight(t2)
            : dp._fill_weight;

    // Scale and transform the vectors accordingly:
    //   normalized * the length it should have + the
    //   offset (the position of the ends of the line
    //   segment) + that half pixel adjustment
    l1.mult(fw1 / 2)
        .add(ps[1])
        .add(d1);
    r1.mult(fw1 / 2)
        .add(ps[1])
        .add(d1);
    l2.mult(fw2 / 2)
        .add(ps[2])
        .add(d2);
    r2.mult(fw2 / 2)
        .add(ps[2])
        .add(d2);

    // If the necessary variables for fill are present
    if (dp._fill && dp._fill_weight) {
        // Get the fill color
        let f = dp._fill instanceof Function ? dp._fill(t1) : dp._fill;
        let sw =
            dp._stroke_weight instanceof Function
                ? dp._stroke_weight(t1)
                : dp._stroke_weight;

        // If the alpha is non-zero and at least one of
        // the fill weights is greater than zero
        if (p.alpha(f) !== 0 && (fw1 > 0 || fw2 > 0)) {
            p.stroke(f);
            p.strokeWeight(fw2 - sw);
            // p.noStroke();

            p.line(ps[1].x, ps[1].y, ps[2].x, ps[2].y);
        }
    }

    // If variables necessary for stroke are present
    if (dp._stroke_weight && dp._stroke) {
        // Get the stroke color and weight
        let s = dp._stroke instanceof Function ? dp._stroke(t1) : dp._stroke;
        let sw =
            dp._stroke_weight instanceof Function
                ? dp._stroke_weight(t1)
                : dp._stroke_weight;

        // If stroke weight is greater than zero, the alpha of
        // the stroke is greater than zero, and at least one
        // of the fill weights is greater than zero
        if (sw > 0 && p.alpha(s) !== 0 && (fw1 > 0 || fw2 > 0)) {
            p.stroke(s);
            p.strokeWeight(sw);

            p.line(l1.x, l1.y, l2.x, l2.y);
            p.line(r1.x, r1.y, r2.x, r2.y);
        }
    }
};
