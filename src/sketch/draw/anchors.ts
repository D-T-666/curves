import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";

export const drawBezierAnchors = (
    p: p5,
    world_transforms: any,
    b: Bezier,
    mouse: p5.Vector,
    pmouse: p5.Vector,
    colors: any,
) => {
    const r = 6;

    let hovering = -1;

    b._anchors.every((a, i) => {
        // If the distance between mouse and the anchor is greater than
        // the anchor's radius, that means it's not being hovered. Skip
        if (pmouse.dist(a) > (r * 1.4141) / world_transforms.scale) return true;
        // Otherwise, set the hovering index to i and end the loop
        hovering = i;
    });

    p.cursor(hovering === -1 ? "default" : "move");

    // Anchors, but transformed to screen soace
    let anchors: p5.Vector[] = b._anchors.map(world_transforms.apply);

    p.stroke(colors.fg);
    p.strokeWeight(1);

    for (let i = 0; i < anchors.length; i++) {
        if (i < anchors.length - 1) {
            // Draw the connecting lines between anchors
            p.line(
                anchors[i].x,
                anchors[i].y,
                anchors[i + 1].x,
                anchors[i + 1].y,
            );
        }

        // Double the size and change the fill color if the anchor is being hovered
        if (hovering === i) {
            p.fill(colors.bgd);
            p.rect(anchors[i].x - r, anchors[i].y - r, r * 2, r * 2);
        } else {
            p.fill(colors.bg);
            p.rect(anchors[i].x - r / 2, anchors[i].y - r / 2, r, r);
        }
    }
};
