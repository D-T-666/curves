import p5 = require("p5");
import { Bezier, createBezier } from "./bezier";
import { drawBezierAnchors } from "./draw/anchors";
import { drawBezierCurve } from "./draw/bezier";
import { drawBoundingBox } from "./draw/boundingBox";
import { interactAnchors } from "./interact/anchors";
import { interactBoundingBox } from "./interact/boundingBox";

export class Scene {
    _beziers: Bezier[];
    _active_bezier: number;
    _active_bezier_mode: number;
    _p5: p5;
    _colors: any;
    _interaction_vars: any;
    _world_transform: {
        offset: p5.Vector,
        scale: number,
        apply: Function,
        unapply: Function,
        [key: string]: any,
    };

    constructor(p: p5) {
        this._p5 = p;
        
        this._colors = {
            bg: p.color(38, 37, 51),
            bgd: p.color(19, 18, 35, 64),
            fg: p.color(237, 250, 255)
        };

        this._interaction_vars = {grabbed: -1};

        this._beziers = [createBezier(p)];
        this._active_bezier = 0;
        this._active_bezier_mode = 1;

        this._world_transform = {
            offset: p.createVector(this._p5.width / 2, this._p5.height / 2),
            scale: 100,
            apply: (point: p5.Vector): p5.Vector => {
                return point.copy().mult(this._world_transform.scale).add(this._world_transform.offset);
            },
            unapply: (point: p5.Vector): p5.Vector => {
                return point.copy().sub(this._world_transform.offset).div(this._world_transform.scale);
            },
        }

        this._beziers[0]._draw_params = {
            _resolution: 100,
            _fill: (t: number): p5.Color => {
                let b = this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 1 + this._p5.frameCount * 0.05)) * 0.5) + 0.5;
                return this._p5.color((t * 127 + 127) * b, 127 * b, (1 - t) * 255 * b);
            },
            _stroke: this._p5.color(255),//240, 180, 40),
            _fill_weight:
             (t: number): number => {
                return this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 1 + this._p5.frameCount * 0.05)) * 16 + 0);
            },
            _stroke_weight: 3,
            _draw_caps: 0,
            _thickness: 6,
        };
    }

    draw() {
        this._p5.background(this._colors.bg);

        const mouse = this._world_transform.unapply(this._p5.createVector(this._p5.mouseX, this._p5.mouseY));
        const pmouse = this._world_transform.unapply(this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY));

        for (let i = 0; i < this._beziers.length; i++) {
            drawBezierCurve(this._p5, this._world_transform, this._beziers[i], "t", this._interaction_vars, false);
            if (i === this._active_bezier) {
                switch (this._active_bezier_mode) {
                case 0:
                    drawBezierAnchors(this._p5, this._world_transform, this._beziers[i], mouse, pmouse, this._colors);
                    break;
                case 1:
                    drawBoundingBox(this._p5, this._world_transform, this._beziers[i], mouse, pmouse, this._colors, this._interaction_vars);
                    break;
                } 
            }
        }
    }

    interact() {
        const mouse = this._world_transform.unapply(this._p5.createVector(this._p5.mouseX, this._p5.mouseY));
        const pmouse = this._world_transform.unapply(this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY));

        for (let i = 0; i < this._beziers.length; i++) {
            if (i === this._active_bezier) {
                switch (this._active_bezier_mode) {
                case 0:
                    interactAnchors(this._p5, this._world_transform, this._beziers[i], mouse, pmouse, this._interaction_vars);
                    break;
                case 1:
                    interactBoundingBox(this._p5, this._world_transform, this._beziers[i], mouse, pmouse, this._interaction_vars);
                    break;
                } 
            }
        }

        if (this._interaction_vars.change_mode) {
            this._active_bezier_mode = 1 - this._active_bezier_mode;
            this._interaction_vars.change_mode = false;
        }

        this._interaction_vars.pmouseIsPressed = this._p5.mouseIsPressed;
        this._interaction_vars.doubleClicked = false;
    }

    doubleClicked() {
        this._interaction_vars.doubleClicked = true;
    }

    mousePan(event: any) {
        // if (event.x >= 216 || event.x <= 16 || event.y >= height - 232 || event.y <= 16)
        if (event.ctrlKey) {
            this._world_transform.scale *= Math.exp(-event.deltaY/100);
        } else {
            this._world_transform.offset.x -= event.deltaX;
            this._world_transform.offset.x -= event.deltaY;
        }
    }
}