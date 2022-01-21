import p5 = require("p5");
import { Bezier, createBezier } from "./bezier";
import { drawBezierAnchors } from "./draw/anchors";
import { drawBezierCurve } from "./draw/bezier";

export class Scene {
    _beziers: Bezier[];
    _p5: p5;
    _colors: any;

    constructor(p: p5) {
        this._p5 = p;
        
        this._colors = {
            bg: p.color(38, 37, 51),
            bgd: p.color(19, 18, 35, 64),
            fg: p.color(237, 250, 255)
        };

        this._beziers = [createBezier(p)];

        this._beziers[0]._draw_params = {
            _resolution: 100,
            _fill: (t: number): p5.Color => {
                let b = this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 3 + this._p5.frameCount * 0.05)) * 0.5) + 0.5;
                return this._p5.color((t * 127 + 127) * b, 127 * b, (1 - t) * 255 * b);
            },
            _stroke: this._p5.color(255),
            _fill_weight:
             (t: number): number => {
                return this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 3 + this._p5.frameCount * 0.05)) * 16 + 0);
            },
            _stroke_weight: 1,
            _draw_caps: 3,
        };
    }

    draw() {
        this._p5.background(this._colors.bg);

        let mouse = this._p5.createVector(this._p5.mouseX, this._p5.mouseY);
        let pmouse = this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY);

        for (let i = 0; i < this._beziers.length; i++) {
            drawBezierAnchors(this._p5, this._beziers[i], mouse, pmouse, this._colors);
            drawBezierCurve(this._p5, this._beziers[i], true);
        }
    }

    interact() {

    }
}