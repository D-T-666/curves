import p5 = require("p5");
import { Bezier } from "../bezier";

export const interactAnchors = (
    p: p5,
    world_transforms: any,
    b: Bezier,
    mouse: p5.Vector,
    pmouse: p5.Vector,
    interaction_vars: any,
) => {
    // TODO: refactor this function
    const r = 6 / world_transforms.scale;

    let hovering = -1;

    let closest_line = -1;
    let closest_line_distance = Infinity;

    for (let i = 0; i < b._anchors.length; i++) {
        if (p5.Vector.dist(pmouse, b._anchors[i]) < r * 1.4141) hovering = i;

        if (i < b._anchors.length - 1) {
            let m = mouse.copy().sub(b._anchors[i]);
            let v = b._anchors[i + 1].copy().sub(b._anchors[i]).mult(-1);
            let v_norm = v.copy().normalize();

            let dot = v_norm.dot(m);

            let p = v_norm.mult(dot).add(b._anchors[i]);

            let d = mouse.dist(p);

            if (dot < 0 && dot > -v.mag() && d < closest_line_distance) {
                closest_line_distance = d;
                closest_line = i;
            }
        }
    }

    if (interaction_vars.doubleClicked) {
        if (hovering >= 0) {
            b._anchors.splice(hovering, 1);
        }
    } else if (p.mouseIsPressed) {
        if (hovering >= 0) {
            b._anchors[hovering].set(mouse);
        } else if (closest_line_distance < r) {
            b._anchors.splice(closest_line + 1, 0, mouse);
        } else {
            interaction_vars.change_mode = true;
        }
    }
};
