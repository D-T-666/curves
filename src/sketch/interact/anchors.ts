import p5 = require("p5");
import { Bezier } from "../bezier";

export const interactAnchors = (p: p5, world_transforms: any, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, interaction_vars: any) => {
	const r = 6;

    let hovering = -1;

    let closest_line = -1;
    let closest_line_distance = Infinity;

	// Anchors, but transformed to screen soace
	let transformed_anchors: p5.Vector[] = b._anchors.map(world_transforms.apply);

	for (let i = 0; i < b._anchors.length; i++) {
		if (p5.Vector.dist(pmouse, transformed_anchors[i]) < r * 1.4141)
            hovering = i;
        
        if (i < b._anchors.length - 1) {
			let m = mouse.copy().sub(transformed_anchors[i]);
			let v = transformed_anchors[i + 1].copy().sub(transformed_anchors[i]).mult(-1);
			let v_norm = v.copy().normalize();
			
			let dot = v_norm.dot(m);
			
			let p = v_norm.mult(dot).add(transformed_anchors[i]);

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
            b._anchors[hovering].set(world_transforms.unapply(mouse));
        } else if (closest_line_distance < r) {
            b._anchors.splice(closest_line + 1, 0, world_transforms.unapply(mouse));
        }
    }
}