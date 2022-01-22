import p5 = require("p5");
import { Bezier } from "../bezier";

export const interactAnchors = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, interaction_vars: any) => {
	const r = 6;

    let hovering = -1;

	for (let i = 0; i < b._anchors.length; i++) {
		if (p5.Vector.dist(pmouse, b._anchors[i].copy().mult(b._size).add(b._pos)) < r * 1.4141)
            hovering = i;
	}

    if (hovering >= 0) {
        if (p.mouseIsPressed) {
            b._anchors[hovering].set(mouse.copy().sub(b._pos).div(b._size));
        }
    }
}