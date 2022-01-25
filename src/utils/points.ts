import p5 = require("p5");

export interface BoundingBox {
    p1: p5.Vector,
    p2: p5.Vector,
    c: p5.Vector,
    r?: number,
};

export const getBoundingBox = (p: p5, points: p5.Vector[], get_radius?: boolean): BoundingBox => {
    let bb: BoundingBox = {
        p1: p.createVector( Infinity,  Infinity),
        p2: p.createVector(-Infinity, -Infinity),
        c: p.createVector(0, 0),
        r: -Infinity
    };

    for (let i = 0; i < points.length; i++) {
        if (points[i].x < bb.p1.x) bb.p1.x = points[i].x;
        if (points[i].x > bb.p2.x) bb.p2.x = points[i].x;
        if (points[i].y < bb.p1.y) bb.p1.y = points[i].y;
        if (points[i].y > bb.p2.y) bb.p2.y = points[i].y;
    }

    bb.c.add(bb.p1).add(bb.p2).div(2);

    if (get_radius) {
        // This is slow, that's why it's optional
        for (let i = 0; i < points.length; i++) {
            let d = p5.Vector.dist(points[i], bb.c);
            if (d > bb.r)
                bb.r = d;
        }
    }

    return bb;
}