import p5 = require("p5");
import { Bezier, createBezier } from "../bezier";
const { rgb2lab, lab2rgb, deltaE } = require("rgb-lab");

// TODO: refactor this file

export class Scene {
    _beziers: Bezier[] = [];
    _p5: p5;
    _colors: any;
    _interaction_vars: any = { grabbed: -1 };
    _world_transform: {
        offset: p5.Vector;
        scale: number;
        apply: (point: p5.Vector) => p5.Vector;
        unapply: (point: p5.Vector) => p5.Vector;
        [key: string]: any;
    };

    private _ui: any;
    public set ui(value: any) {
        this._ui = value;
    }

    // Focus
    focused_curves: number[] = [];
    focus_mode: number = 1;
    set_focus_mode: (mode: "anchor-edit" | "transform") => void;
    set_focus: (index: number) => boolean;
    get_focused: () => number[];
    is_focused: (index: number) => boolean;
    add_focus: (index: number) => boolean;

    // Interact
    interact: () => void;
    doubleClicked: () => void;
    mousePan: (event: any) => void;

    // Draw
    draw: () => void;

    constructor(p: p5) {
        this._p5 = p;

        this._colors = {
            // Dark
            bg: this._p5.color(38, 37, 51, 255),
            bgd: this._p5.color(19, 18, 35, 63),
            fg: this._p5.color(237, 250, 255, 255),
            fgd: this._p5.color(237, 250, 255, 63),

            // Light
            //     bg: this._p5.color(255, 255),
            //     bgd: this._p5.color(255, 63),
            //     fg: this._p5.color(0, 255),
            //     fgd: this._p5.color(0, 63),
        };

        this._world_transform = {
            offset: this._p5.createVector(
                this._p5.width / 2,
                this._p5.height / 2,
            ),
            scale: 100,
            apply: (point: p5.Vector): p5.Vector =>
                point
                    .copy()
                    .mult(this._world_transform.scale)
                    .add(this._world_transform.offset),
            unapply: (point: p5.Vector): p5.Vector =>
                point
                    .copy()
                    .sub(this._world_transform.offset)
                    .div(this._world_transform.scale),
        };

        if (window.localStorage.getItem("has_saved_data")) {
            this._beziers = readCurvesFromLocalStorage(this._p5);

            this._beziers.forEach((bezier) => {
                bezier._draw_params = {
                    _resolution: 75,
                    _fill: this._colors.bg,
                    // (t: number): p5.Color => {
                    //     let a1 = rgb2lab([255, 20, 100]);
                    //     let a2 = rgb2lab([20, 160, 255]);
                    //     let col: [number, number, number] = lab2rgb([
                    //         this._p5.lerp(a1[0], a2[0], t),
                    //         this._p5.lerp(a1[1], a2[1], t),
                    //         this._p5.lerp(a1[2], a2[2], t),
                    //     ]);
                    //     return this._p5.color(...col);
                    // },
                    _stroke: this._p5.color(255),
                    _fill_weight: 32,
                    _stroke_weight: 4,
                    _caps: 15,
                    _thickness: 32,
                    _kind: "thick",
                };
            });
        } else {
            this.createNewCurve();
            writeCurvesToLocalStorage(this._beziers);
        }

        window.addEventListener("beforeunload", (e) => {
            writeCurvesToLocalStorage(this._beziers);
            window.localStorage.setItem("has_saved_data", "true");
        });
    }

    createNewCurve(name?: string) {
        this._beziers.push(
            createBezier(
                this._p5,
                name ? name : `curve ${this._beziers.length}`,
            ),
        );

        this._beziers[this._beziers.length - 1]._draw_params = {
            _resolution: 75,
            _fill: (t: number): p5.Color => {
                let a1 = rgb2lab([0, 100, 255]);
                let a2 = rgb2lab([255, 140, 100]);
                let col: [number, number, number] = lab2rgb([
                    this._p5.lerp(a1[0], a2[0], t),
                    this._p5.lerp(a1[1], a2[1], t),
                    this._p5.lerp(a1[2], a2[2], t),
                ]);
                return this._p5.color(...col);
            },
            _stroke: this._p5.color(0),
            _fill_weight: 32,
            _stroke_weight: 0,
            _caps: 3,
            _thickness: 32,
            _kind: "thick",
        };
    }
}

import "./focus";
import "./interact";
import "./draw";
import {
    readCurvesFromLocalStorage,
    writeCurvesToLocalStorage,
} from "../storage/localStorage";
