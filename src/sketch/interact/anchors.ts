import p5 = require("p5");
import { Bezier } from "../bezier";

export const interactAnchors = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector) => {
	const r = 6;

    let hovering = -1;

	for (let i = 0; i < b._anchors.length; i++) {
		const is_hovering = p.dist(pmouse.x, pmouse.y, b._anchors[i].x * b._size + b._pos.x, b._anchors[i].y * b._size + b._pos.y) < r * 1.4141;
		if (is_hovering) hovering = i;
	}

    if (hovering >= 0) {
        if (p.mouseIsPressed) {
            b._anchors[hovering].set(mouse.copy().sub(b._pos).div(b._size));
        }
    }
}