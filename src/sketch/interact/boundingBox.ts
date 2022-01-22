import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";
import { getCurve } from "../getCurve";

export const interactBoundingBox = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, interaction_vars: any) => {
    const r = 6;

    let { p1, p2 } = getBoundingBox(p, getCurve(p, b, 15));

    let cs = [
        p.createVector(p1.x - r * 2, p1.y - r * 2),
        p.createVector(p2.x + r * 2, p1.y - r * 2),
        p.createVector(p1.x - r * 2, p2.y + r * 2),
        p.createVector(p2.x + r * 2, p2.y + r * 2)
    ];

    let hovering = -1;
    if (interaction_vars.pmouseIsPressed && interaction_vars.grabbed >= 0) {
        hovering = interaction_vars.grabbed;
    } else {
        for (let i = 0; i < 8; i++) {
            let c = i < 4 ? cs[i] : cs[[0, 1, 3, 2][i - 4]].copy().add(cs[[1, 3, 2, 0][i - 4]]).div(2);

            if (pmouse.x > c.x - r && pmouse.x < c.x + r && pmouse.y > c.y - r && pmouse.y < c.y + r) {
                hovering = i;
                break;
            }
        }

        if (hovering < 0 && pmouse.x > cs[0].x && pmouse.x < cs[3].x && pmouse.y > cs[0].y && pmouse.y < cs[3].y)
            hovering = 8;
    }
    interaction_vars.grabbed = hovering;

    if (hovering >= 0 && p.mouseIsPressed) {
        let mouse_delta = mouse.copy().sub(pmouse);
        if (hovering === 8) {
            b._pos.add(mouse_delta);
        } else if (hovering > 3) {
            let d: number;
            let s: number;
            switch (hovering & 3) {
                case 0:
                    d = (cs[3].y - mouse.y) / (cs[3].y - pmouse.y);
                    s = d + 4 * r * (d - 1) / (p2.y - p1.y - 4 * r);
                    b._pos.y -= (s - 1) * (p2.y - b._pos.y);
                    break;
                case 1: 
                    d = (cs[0].x - mouse.x) / (cs[0].x - pmouse.x);
                    s = d + 4 * r * (d - 1) / (cs[3].x - cs[0].x - 4 * r);
                    b._pos.x -= (s - 1) * (p1.x - b._pos.x);
                    break;
                case 2: 
                    d = (cs[0].y - mouse.y) / (cs[0].y - pmouse.y);
                    s = d + 4 * r * (d - 1) / (cs[3].y - cs[0].y - 4 * r);
                    b._pos.y -= (s - 1) * (p1.y - b._pos.y);
                    break;
                case 3:
                    d = (cs[3].x - mouse.x) / (cs[3].x - pmouse.x);
                    s = d + 4 * r * (d - 1) / (cs[3].x - cs[0].x - 4 * r);
                    b._pos.x -= (s - 1) * (p2.x - b._pos.x);
                    break;
            }
            if ((hovering & 1) === 0) b._anchors.forEach(a => a.y *= s);
            else b._anchors.forEach(a => a.x *= s);
        } else {
            let c = cs[3 - hovering];

            let d = p5.Vector.dist(mouse, c) / p5.Vector.dist(pmouse, c);

            b._pos.y += (b._pos.y - c.y - r * 2 * (2 * Number((hovering & 2) !== 0) - 1)) * (d - 1);
            b._pos.x += (b._pos.x - c.x - r * 2 * (2 * Number((hovering & 1) !== 0) - 1)) * (d - 1);
            
            b._size *= d;
        }
    }
}