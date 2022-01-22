import p5 = require("p5");
import { getBoundingBox } from "../../utils/points";
import { Bezier } from "../bezier";
import { getCurve } from "../getCurve";

export const drawBoundingBox = (p: p5, b: Bezier, mouse: p5.Vector, pmouse: p5.Vector, colors: any, interaction_vars: any) => {
    const r = 6;

	let bb = getBoundingBox(p, getCurve(p, b, 15));
    let overscan = p.createVector(r*2, r*2);
    bb.p1.sub(overscan);
    bb.p2.add(overscan);

    let c1 = p.createVector(bb.p1.x, bb.p1.y);
    let c2 = p.createVector(bb.p2.x, bb.p1.y);
    let c3 = p.createVector(bb.p1.x, bb.p2.y);
    let c4 = p.createVector(bb.p2.x, bb.p2.y);
    
	p.stroke(colors.fg);
	p.strokeWeight(1);
	p.fill(colors.bgd);
	p.rect(bb.p1.x, bb.p1.y, bb.p2.x - bb.p1.x, bb.p2.y - bb.p1.y);

    p.cursor("default")


    if (interaction_vars.grabbed === 0) {
        p.fill(colors.bgd);
        p.rect(c1.x - r, c1.y - r, r * 2, r * 2);
        p.cursor("nwse-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c1.x - r * 0.5, c1.y - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 1) {
        p.fill(colors.bgd);
        p.rect(c2.x - r, c2.y - r, r * 2, r * 2);
        p.cursor("nesw-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c2.x - r * 0.5, c2.y - r * 0.5, r, r);
    }
    
    if (interaction_vars.grabbed === 2) {
        p.fill(colors.bgd);
	    p.rect(c3.x - r, c3.y - r, r * 2, r * 2);
        p.cursor("nesw-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c3.x - r * 0.5, c3.y - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 3) {
        p.fill(colors.bgd);
        p.rect(c4.x - r, c4.y - r, r * 2, r * 2);
        p.cursor("nwse-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c4.x - r * 0.5, c4.y - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 4) {
        p.fill(colors.bgd);
        p.rect(c1.x * 0.5 + c4.x * 0.5 - r, c1.y - r, r * 2, r * 2);
        p.cursor("ns-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c1.x * 0.5 + c4.x * 0.5 - r * 0.5, c1.y - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 5) {
        p.fill(colors.bgd);
        p.rect(c4.x - r, c1.y * 0.5 + c4.y * 0.5 - r, r * 2, r * 2);
        p.cursor("ew-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c4.x - r * 0.5, c1.y * 0.5 + c4.y * 0.5 - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 6) {
        p.fill(colors.bgd);
        p.rect(c1.x * 0.5 + c4.x * 0.5 - r, c4.y - r, r * 2, r * 2);
        p.cursor("ns-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c1.x * 0.5 + c4.x * 0.5 - r * 0.5, c4.y - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 7) {
        p.fill(colors.bgd);
        p.rect(c1.x - r, c1.y * 0.5 + c4.y * 0.5 - r, r * 2, r * 2);
        p.cursor("ew-resize");
    } else {
        p.fill(colors.bg);
        p.rect(c1.x - r * 0.5, c1.y * 0.5 + c4.y * 0.5 - r * 0.5, r, r);
    }

    if (interaction_vars.grabbed === 8) {
        p.cursor("move");
    }
}