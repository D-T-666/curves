// import * as p5 from "p5";

import { bezierDrawParams } from "./draw/bezier";

export interface PlainBezier {
    _anchors: number[][];
    _name: string;
    _base_line: number;
}

export interface Bezier extends Omit<PlainBezier, "_anchors" | "_pos"> {
    _anchors: p5.Vector[];
    _draw_params?: bezierDrawParams;
    _vars?: any;
    [key: string]: any;
}

export const copyBezier = (b: Bezier): Bezier => {
    return {
        ...b,
        _anchors: b._anchors.map((a) => a.copy()),
        _name: b._name,
        _base_line: b._base_line,
        _vars: { ...b._vars },
    };
};

export const createBezier = (p: p5, name?: string): Bezier => {
    const _new_bezier: Bezier = {
        _anchors: [
            p.createVector(0, 0),
            p.createVector(1, 1.5),
            p.createVector(-4, -2.5),
            p.createVector(-1, -0.5),
            p.createVector(1, 0),
        ],
        _name: name,
        _base_line: 2,
        _vars: {},
    };

    return _new_bezier;
};

export const getPlainBezier = (b: Bezier): PlainBezier => ({
    _name: b._name,
    _anchors: b._anchors.map((v) => [v.x, v.y]),
    _base_line: 1,
});

export const bezier2JSON = (b: Bezier): string => {
    return JSON.stringify(getPlainBezier(b));
};
