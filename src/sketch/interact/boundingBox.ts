import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";
import { getCurve } from "../getCurve";

export const interactBoundingBox = (p: p5, world_transforms: any, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, interaction_vars: any) => {
    const r = 6 / world_transforms.scale;

    let bb = getBoundingBox(p, getCurve(p, b._anchors, 15), true);

    let cs = [
        p.createVector(bb.p1.x - (r + b._draw_params._thickness / world_transforms.scale), bb.p1.y - (r + b._draw_params._thickness / world_transforms.scale)),
        p.createVector(bb.p2.x + (r + b._draw_params._thickness / world_transforms.scale), bb.p1.y - (r + b._draw_params._thickness / world_transforms.scale)),
        p.createVector(bb.p1.x - (r + b._draw_params._thickness / world_transforms.scale), bb.p2.y + (r + b._draw_params._thickness / world_transforms.scale)),
        p.createVector(bb.p2.x + (r + b._draw_params._thickness / world_transforms.scale), bb.p2.y + (r + b._draw_params._thickness / world_transforms.scale))
    ];

    let cc = [
        p.createVector(bb.p1.x, bb.p1.y),
        p.createVector(bb.p2.x, bb.p1.y),
        p.createVector(bb.p1.x, bb.p2.y),
        p.createVector(bb.p2.x, bb.p2.y),
    ];

    let rot_anchor = bb.c.copy().sub(p.createVector(0, bb.r + r * 3));

    let hovering = -1;
    if (interaction_vars.pmouseIsPressed) {
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

        if (hovering < 0 && pmouse.x > rot_anchor.x - r && pmouse.x < rot_anchor.x + r && pmouse.y > rot_anchor.y - r && pmouse.y < rot_anchor.y + r)
            hovering = 9;
    }
    interaction_vars.grabbed = hovering;

    if (p.mouseIsPressed) {
        let mouse_delta = mouse.copy().sub(pmouse);
        if (hovering === 8) {
            b._anchors.forEach(a => a.add(mouse_delta));
        } else if (hovering < 8 && hovering > 3) {
            let d: number;
            let s: number;
            switch (hovering & 3) {
                case 0:
                    d = (cs[3].y - mouse.y) / (cs[3].y - pmouse.y);
                    s = d + 4 * r * (d - 1) / (bb.p2.y - bb.p1.y - 4 * r);
                    b._pos.y -= (s - 1) * (bb.p2.y - b._pos.y);
                    break;
                case 1: 
                    d = (cs[0].x - mouse.x) / (cs[0].x - pmouse.x);
                    s = d + 4 * r * (d - 1) / (cs[3].x - cs[0].x - 4 * r);
                    b._pos.x -= (s - 1) * (bb.p1.x - b._pos.x);
                    break;
                case 2: 
                    d = (cs[0].y - mouse.y) / (cs[0].y - pmouse.y);
                    s = d + 4 * r * (d - 1) / (cs[3].y - cs[0].y - 4 * r);
                    b._pos.y -= (s - 1) * (bb.p1.y - b._pos.y);
                    break;
                case 3:
                    d = (cs[3].x - mouse.x) / (cs[3].x - pmouse.x);
                    s = d + 4 * r * (d - 1) / (cs[3].x - cs[0].x - 4 * r);
                    b._pos.x -= (s - 1) * (bb.p2.x - b._pos.x);
                    break;
            }

            let c: number = [cc[3].y, cc[0].x, cc[0].y, cc[3].x][hovering - 4];

            if (hovering % 2)
                b._anchors.forEach(a => a.x = (a.x - c) * s + c);
            else 
                b._anchors.forEach(a => a.y = (a.y - c) * s + c);

        } else if (hovering <= 3 && hovering >= 0) {
            let c = cc[3 - hovering];

            let d = p5.Vector.dist(mouse, c) / p5.Vector.dist(pmouse, c);

            b._anchors.forEach(a => {
                a.sub(c).mult(d).add(c)
            });
        }
        if (hovering === 9) {
            b._new_anchors = b._anchors.map((a: p5.Vector) => {
                
                return a.copy()
                    .sub(bb.c)
                    .rotate(bb.c.copy().sub(mouse).heading() - p.HALF_PI)
                    .add(bb.c);
            });
        }
    } else {
        if (hovering === 8)
            interaction_vars.change_mode = interaction_vars.doubleClicked;
        if (hovering === 9) {
            if (interaction_vars.pmouseIsPressed) {
                b._anchors = b._new_anchors;
            }
        }
    }
}