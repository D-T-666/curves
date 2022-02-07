import p5 = require("p5");
import { Bezier } from "../bezier";

const writeToLocalStorage = (raw_data: any | string) => {
    const data: string = <string>(
        (raw_data instanceof String ? raw_data : JSON.stringify(raw_data))
    );
    window.localStorage.setItem("curve-data", data);
};

export const writeCurvesToLocalStorage = (curves: Bezier[]) => {
    let data: { curves: any[] } = {
        curves: [],
    };

    curves.forEach((curve) => {
        data.curves.push({
            anchors: curve._anchors.map((a) => [a.x, a.y]),
            name: curve._name,
        });
    });

    writeToLocalStorage(data);
};

export const readCurvesFromLocalStorage = (p: p5): Bezier[] => {
    const raw_data = window.localStorage.getItem("curve-data");
    const data = JSON.parse(raw_data);

    console.log(data);

    return data.curves.map((curve: any) => ({
        _anchors: curve.anchors.map((a: number[]) =>
            p.createVector(a[0], a[1]),
        ),
        _name: curve.name,
        _base_line: 0,
        _thickness: 0,
    }));
};
