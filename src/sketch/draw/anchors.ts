import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";

export const drawBezierAnchors = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, colors: any) => {
	const r = 6;
	
	let smallest_distance = Infinity;

	let bb = getBoundingBox(p, b._anchors);
    bb.p1.mult(b._size).add(b._pos);
    bb.p2.mult(b._size).add(b._pos);
    
	p.stroke(colors.fg);
	p.strokeWeight(1);
	p.fill(colors.bgd);
	p.rect(bb.p1.x - r * 2, bb.p1.y - r * 2, bb.p2.x - bb.p1.x + r * 4, bb.p2.y - bb.p1.y + r * 4);

	p.fill(colors.bg);
	p.rect(bb.p1.x - r * 2.5, bb.p1.y - r * 2.5, r, r);
	p.rect(bb.p2.x + r * 1.5, bb.p1.y - r * 2.5, r, r);
	p.rect(bb.p1.x - r * 2.5, bb.p2.y + r * 1.5, r, r);
	p.rect(bb.p2.x + r * 1.5, bb.p2.y + r * 1.5, r, r);

	let mouse_on_anchor = false;
    let hovering = -1;

	for (let i = 0; i < b._anchors.length; i++) {
		const is_hovering = p.dist(p.pmouseX, p.pmouseY, b._anchors[i].x * b._size + b._pos.x, b._anchors[i].y * b._size + b._pos.y) < r * 1.4141;
		mouse_on_anchor = mouse_on_anchor || is_hovering;
		if (is_hovering) hovering = i;
	}
	
	for (let i = 0; i < b._anchors.length; i++) {
		if (i < b._anchors.length - 1) {
            p.stroke(colors.fg);
			p.strokeWeight(1);
			
			p.line(
				b._anchors[i].x * b._size + b._pos.x,
				b._anchors[i].y * b._size + b._pos.y,
				b._anchors[i + 1].x * b._size + b._pos.x,
				b._anchors[i + 1].y * b._size + b._pos.y
			)
		}

		
		if (hovering === i) {
			p.fill(colors.bgd);
            p.stroke(colors.fg);
            p.strokeWeight(1);
            p.rect(b._anchors[i].x * b._size + b._pos.x - r, b._anchors[i].y * b._size + b._pos.y - r, r * 2, r * 2);
		} else {
            p.stroke(colors.fg);
            p.strokeWeight(1);
            p.fill(colors.bg)
            p.rect(b._anchors[i].x * b._size + b._pos.x - r / 2, b._anchors[i].y * b._size + b._pos.y - r / 2, r, r);
        }

	}
};