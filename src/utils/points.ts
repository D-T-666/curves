import p5 = require("p5");

export interface BoundingBox {
    p1: p5.Vector,
    p2: p5.Vector,
};

export const getBoundingBox = (p: p5, points: p5.Vector[]): BoundingBox => {
    let bb: BoundingBox = {
        p1: p.createVector( Infinity,  Infinity),
        p2: p.createVector(-Infinity, -Infinity)
    };

    for (let i = 0; i < points.length; i++) {
        if (points[i].x < bb.p1.x) bb.p1.x = points[i].x;
        if (points[i].x > bb.p2.x) bb.p2.x = points[i].x;
        if (points[i].y < bb.p1.y) bb.p1.y = points[i].y;
        if (points[i].y > bb.p2.y) bb.p2.y = points[i].y;
    }

    return bb;
}