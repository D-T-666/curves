import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";
import { getCurve } from "../getCurve";

export const drawBoundingBox = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, colors: any, interaction_vars: any) => {
    const r = 6;

    let bb = getBoundingBox(p, getCurve(p, b._anchors, 15, {
        offset: b._pos,
        scale: b._size
    }), true);

    let overscan = p.createVector(r * 2, r * 2);
    bb.p1.sub(overscan).sub(bb.c);
    bb.p2.add(overscan).sub(bb.c);
    bb.r += r * 2 * p.sqrt(2);

    let cs = [
        p.createVector(bb.p1.x, bb.p1.y),
        p.createVector(bb.p2.x, bb.p1.y),
        p.createVector(bb.p1.x, bb.p2.y),
        p.createVector(bb.p2.x, bb.p2.y)
    ];

    p.push();
    p.translate(bb.c.x, bb.c.y);

    p.stroke(colors.fg);
    p.strokeWeight(1);
    p.fill(colors.bgd);

    p.cursor("default")

    if (interaction_vars.grabbed === 9 && p.mouseIsPressed) {
        p.ellipse(0, 0, bb.r * 2, bb.r * 2);
        p.rotate(bb.c.copy().sub(mouse).heading() - p.HALF_PI);
    } else {
        p.rect(bb.p1.x, bb.p1.y, bb.p2.x - bb.p1.x, bb.p2.y - bb.p1.y);

        for (let i = 0; i < 8; i++) {
            let c = i < 4 ? cs[i] : cs[[0, 1, 3, 2][i - 4]].copy().add(cs[[1, 3, 2, 0][i - 4]]).div(2);

            if (interaction_vars.grabbed === i) {
                p.fill(colors.bgd);
                p.rect(c.x - r, c.y - r, r * 2, r * 2);
                if (i < 4)
                    p.cursor((i & 1) === (i & 2) / 2 ? "nwse-resize" : "nesw-resize");
                else if (i < 8)
                    p.cursor(i < 8 && i % 2 === 0 ? "ns-resize" : "ew-resize");
            } else {
                p.fill(colors.bg);
                p.rect(c.x - r * 0.5, c.y - r * 0.5, r, r);
            }
        }

        if (interaction_vars.grabbed === 8) {
            p.cursor("move");
        }

        p.line(0,  bb.p1.y - r * ((interaction_vars.grabbed === 4) ? 1 : 0.5), 
               0, -bb.r    + r * ((interaction_vars.grabbed === 9) ? 1 : 0.5));
    }

    if (interaction_vars.grabbed === 9) {
        p.fill(colors.bgd);
        p.rect(-r, -bb.r - r, r * 2, r * 2);
        p.cursor("move");
    } else {
        p.fill(colors.bg);
        p.rect(-r * 0.5, - bb.r - r / 2, r, r);
    }

    p.pop();
}