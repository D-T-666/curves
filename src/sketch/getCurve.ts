import * as p5 from "p5";

const lerp_vector = (
    p: p5,
    a: p5.Vector,
    b: p5.Vector,
    t: number,
): p5.Vector => {
    return p.createVector(p.lerp(a.x, b.x, t), p.lerp(a.y, b.y, t));
};

// Regular Bezier
export const getCurve = (
    p: p5,
    anchors: p5.Vector[],
    resolution: number,
    transform?: Function,
): p5.Vector[] => {
    let points: p5.Vector[] = [];

    for (let i = 0; i < resolution + 1; i++) {
        let a = [...anchors];

        for (let j = anchors.length; j >= 0; j--) {
            for (let q = 0; q < j - 1; q++) {
                a[q] = p.createVector(
                    p.lerp(a[q].x, a[q + 1].x, i / resolution),
                    p.lerp(a[q].y, a[q + 1].y, i / resolution),
                );
            }
        }

        if (transform) points.push(transform(a[0]));
        else points.push(a[0]);
    }

    return points;
};

// // Cubic B-spline
// export const getCurve = (p: p5, b_anchors: p5.Vector[], resolution: number, transform?: Function): p5.Vector[] => {
//     let points: p5.Vector[] = [];

//     let anchors: p5.Vector[] = [ b_anchors[0], b_anchors[1] ];

//     let l = b_anchors.length;
//     for (let i = 2; i < l - 2; i++) {
//         anchors.push(lerp_vector(p,
//             b_anchors[i - 1],
//             b_anchors[i],
//             (i > 2 && i < i - 3) ? 1/3 : 1/2
//         ));
//         anchors.push(lerp_vector(p,
//             lerp_vector(p,
//                 b_anchors[i - 1],
//                 b_anchors[i],
//                 (i > 2 && i < i - 3) ? 1/3 : 1/2
//             ),
//             lerp_vector(p,
//                 b_anchors[i],
//                 b_anchors[i + 1],
//                 (i > 2 && i < i - 3) ? 1/3 : 1/2
//             ),
//             1/2
//         ));
//         anchors.push(lerp_vector(p,
//             b_anchors[i],
//             b_anchors[i + 1],
//             (i > 2 && i < i - 3) ? 1/3 : 1/2
//         ));
//     }

//     anchors.push(b_anchors[l - 2]);
//     anchors.push(b_anchors[l - 1]);

//     for (let i = 0; i < resolution + 1; i++) {
//         let t = i / (resolution) * (b_anchors.length - 3);
//         let bezier_index = Math.floor(i / (resolution + 1) * (b_anchors.length - 3));
//         t -= bezier_index;

//         let a: p5.Vector[] = [
//             anchors[bezier_index * 3 + 0].copy(),
//             anchors[bezier_index * 3 + 1].copy(),
//             anchors[bezier_index * 3 + 2].copy(),
//             anchors[bezier_index * 3 + 3].copy()
//         ];

//         a[0] =
//             a[0].mult(  -t*t*t + 3*t*t - 3*t + 1).add(
//             a[1].mult( 3*t*t*t - 6*t*t + 3*t    )).add(
//             a[2].mult(-3*t*t*t + 3*t*t          )).add(
//             a[3].mult(   t*t*t                  ));

//         points.push(transform ? transform(a[0]) : a[0]);
//     }

//     return points;
// };
