import p5 = require("p5");

export interface BoundingBox {
    p1: p5.Vector,
    p2: p5.Vector,
    c: p5.Vector,
    cg?: p5.Vector,
    r?: number,
};

export const pointInBox = (p: p5, point: p5.Vector, bb: BoundingBox): boolean => {
    return point.x > bb.p1.x && point.x < bb.p2.x && point.y > bb.p1.y && point.y < bb.p2.y;
}

export const getBoundingBox = (p: p5, points: p5.Vector[], get_radius?: boolean): BoundingBox => {
    let bb: BoundingBox = {
        p1: p.createVector( Infinity,  Infinity),
        p2: p.createVector(-Infinity, -Infinity),
        c: p.createVector(0, 0),
    };

    if (get_radius) {
        bb.r = -Infinity;
        bb.cg = p.createVector(0, 0);
    }

    for (let i = 0; i < points.length; i++) {
        if (points[i].x < bb.p1.x) bb.p1.x = points[i].x;
        if (points[i].x > bb.p2.x) bb.p2.x = points[i].x;
        if (points[i].y < bb.p1.y) bb.p1.y = points[i].y;
        if (points[i].y > bb.p2.y) bb.p2.y = points[i].y;
        if (get_radius) bb.cg.add(points[i]);
    }

    bb.c.add(bb.p1).add(bb.p2).div(2);

    if (get_radius) {
        bb.r = bb.c.copy().sub(bb.p1).mag();
        bb.cg.div(points.length);
        // This is slow, that's why it's optional
        for (let i = 0; i < points.length; i++) {
            let d = points[i].copy().sub(bb.c).magSq();
            if (d > bb.r * bb.r)
                bb.r = p.sqrt(d);
        }
    }

    return bb;
}