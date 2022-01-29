import p5 = require("p5");
import { Bezier, createBezier } from "../bezier";

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
            bg: this._p5.color(38, 37, 51, 255),
            bgd: this._p5.color(19, 18, 35, 63),
            fg: this._p5.color(237, 250, 255, 255),
            fgd: this._p5.color(237, 250, 255, 63),
        };

        this._world_transform = {
            offset: this._p5.createVector(
                this._p5.width / 2,
                this._p5.height / 2
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

        this.createNewCurve();
    }

    createNewCurve(name?: string) {
        this._beziers.push(
            createBezier(
                this._p5,
                name ? name : `curve ${this._beziers.length}`
            )
        );

        this._beziers[this._beziers.length - 1]._draw_params = {
            _resolution: 100,
            _fill: (t: number): p5.Color => {
                let b =
                    this._p5.abs(
                        this._p5.abs(
                            this._p5.sin(
                                t * this._p5.TWO_PI * 1 +
                                    this._p5.frameCount * 0.05
                            )
                        ) * 0.5
                    ) + 0.5;
                return this._p5.color(
                    (t * 127 + 127) * b,
                    127 * b,
                    (1 - t) * 255 * b
                );
            },
            _stroke: this._p5.color(255),
            _fill_weight: (t: number): number => {
                return this._p5.abs(
                    this._p5.abs(
                        this._p5.sin(
                            t * this._p5.TWO_PI * 1 + this._p5.frameCount * 0.05
                        )
                    ) *
                        16 +
                        0
                );
            },
            _stroke_weight: 0,
            _draw_caps: 0,
            _thickness: 6,
        };
    }
}

import "./focus";
import "./interact";
import "./draw";
