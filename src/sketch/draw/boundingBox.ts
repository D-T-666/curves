import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";
import { getCurve } from "../getCurve";

function drawControlBox(p: p5, x: number, y: number, s: number) {
    p.rect(x, y, s, s);
}

export const drawBoundingBox = (
    p: p5,
    world_transforms: any,
    b: Bezier,
    mouse: p5.Vector,
    pmouse: p5.Vector,
    colors: any,
    interaction_vars: any,
) => {
    const s = 6;

    // The Bounding Box - bb
    let bb = getBoundingBox(
        p,
        getCurve(p, b._anchors, 15, world_transforms.apply),
    );

    let padding = p.createVector(
        s + b._draw_params._thickness,
        s + b._draw_params._thickness,
    );

    // Get the top left and the bottom right corners of the bounding
    // box but centered on the origin and with the added padding.
    let p1 = bb.p1.sub(padding).sub(bb.c);
    let p2 = bb.p2.add(padding).sub(bb.c);
    // Get the radius of the bounding box
    let raduis = p1.mag();

    p.push();
    p.rectMode(p.CENTER);
    // Put the origin of the canvas at the center of the bounding box
    p.translate(bb.c.x, bb.c.y);

    p.stroke(colors.fg);
    p.strokeWeight(1);
    p.noFill();

    p.cursor("default");

    if (interaction_vars.grabbed === 9 && p.mouseIsPressed) {
        // Draw the circle encapsulating the BB with a dim shadow
        p.strokeWeight(s);
        p.stroke(colors.bgd);
        p.ellipse(0, 0, raduis * 2, raduis * 2);
        p.strokeWeight(1);
        p.stroke(colors.fg);
        p.ellipse(0, 0, raduis * 2, raduis * 2);

        p.rotate(
            world_transforms.unapply(bb.c).sub(mouse).heading() - p.HALF_PI,
        );
    } else {
        let cs = [
            p.createVector(p1.x, p1.y),
            p.createVector(p2.x, p1.y),
            p.createVector(p1.x, p2.y),
            p.createVector(p2.x, p2.y),
        ];

        // Draw the outline of the BB with a dim shadow
        p.strokeWeight(s);
        p.stroke(colors.bgd);
        p.rect(0, 0, p2.x - p1.x, p2.y - p1.y);
        p.strokeWeight(1);
        p.stroke(colors.fg);
        p.rect(0, 0, p2.x - p1.x, p2.y - p1.y);

        for (let i = 0; i < 8; i++) {
            let box: p5.Vector;
            if (i < 4) {
                box = cs[i];
            } else {
                box = p5.Vector.add(
                    cs[[0, 1, 3, 2][i - 4]],
                    cs[[1, 3, 2, 0][i - 4]],
                ).div(2);
            }

            let is_grabbed = interaction_vars.grabbed === i;
            p.fill(is_grabbed ? colors.bgd : colors.bg);
            drawControlBox(p, box.x, box.y, s * (is_grabbed ? 2 : 1));

            if (interaction_vars.grabbed === i) {
                if (i < 4) {
                    p.cursor(
                        (i & 1) === (i & 2) / 2 ? "nwse-resize" : "nesw-resize",
                    );
                } else if (i < 8) {
                    p.cursor(i % 2 ? "ew-resize" : "ns-resize");
                }
            }
        }

        if (interaction_vars.grabbed === 8) p.cursor("move");

        p.line(
            0,
            p1.y - s * (interaction_vars.grabbed === 4 ? 1 : 0.5),
            0,
            -raduis + s * (interaction_vars.grabbed === 9 ? 1 : 0.5),
        );
    }

    if (interaction_vars.grabbed === 9) {
        p.fill(colors.bgd);
        p.cursor("move");
    } else {
        p.fill(colors.bg);
    }
    drawControlBox(p, 0, -raduis, s * (interaction_vars.grabbed === 9 ? 2 : 1));

    p.rectMode(p.CORNER);
    p.pop();
};
