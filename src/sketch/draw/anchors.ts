import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";

export const drawBezierAnchors = (p: p5, world_transforms: any, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, colors: any) => {
	const r = 6;

	let mouse_on_anchor = false;
    let hovering = -1;

	for (let i = 0; i < b._anchors.length; i++) {
		const is_hovering = p.dist(p.pmouseX, p.pmouseY, b._anchors[i].x, b._anchors[i].y) < r * 1.4141;
		mouse_on_anchor = mouse_on_anchor || is_hovering;
		if (is_hovering) hovering = i;
	}

	// Anchors, but transformed to screen soace
	let transformed_anchors: p5.Vector[] = b._anchors.map(world_transforms.apply);
	
	for (let i = 0; i < b._anchors.length; i++) {
		if (i < b._anchors.length - 1) {
            p.stroke(colors.fg);
			p.strokeWeight(1);
			
			p.line(
				transformed_anchors[i].x,
				transformed_anchors[i].y,
				transformed_anchors[i + 1].x,
				transformed_anchors[i + 1].y
			)
		}
		
		if (hovering === i) {
			p.fill(colors.bgd);
            p.stroke(colors.fg);
            p.strokeWeight(1);
            p.rect(transformed_anchors[i].x - r, transformed_anchors[i].y - r, r * 2, r * 2);
		} else {
            p.stroke(colors.fg);
            p.strokeWeight(1);
            p.fill(colors.bg)
            p.rect(transformed_anchors[i].x - r / 2, transformed_anchors[i].y - r / 2, r, r);
        }

	}
};