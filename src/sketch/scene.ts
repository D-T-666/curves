import p5 = require("p5");
import { getBoundingBox, pointInBox } from "../utils/points";
import { Bezier, createBezier } from "./bezier";
import { drawBezierAnchors } from "./draw/anchors";
import { drawBezierCurve } from "./draw/bezier";
import { drawBoundingBox } from "./draw/boundingBox";
import { getCurve } from "./getCurve";
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
    ui: any;

    constructor(p: p5) {
        this._p5 = p;
        
        this._colors = {
            bg: p.color(38, 37, 51),
            bgd: p.color(19, 18, 35, 63),
            fg: p.color(237, 250, 255),
            fgd: p.color(237, 250, 255, 63),
        };

        this._interaction_vars = {grabbed: -1};

        this._beziers = [];
        this._active_bezier = -1;
        this._active_bezier_mode = 0;

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

        this.createNewCurve();
    }

    set_ui_callbacks(callbacks: any) {
        this.ui = callbacks;
    } 

    focus(index: number, defocus_others?: boolean) {
        this._active_bezier = index;
        this._active_bezier_mode = 1;
    }

    createNewCurve(name?: string) {
        this._beziers.push(createBezier(this._p5, name ? name : `curve ${this._beziers.length}`));

        this._beziers[this._beziers.length - 1]._draw_params = {
            _resolution: 100,
            _fill: (t: number): p5.Color => {
                let b = this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 1 + this._p5.frameCount * 0.05)) * 0.5) + 0.5;
                return this._p5.color((t * 127 + 127) * b, 127 * b, (1 - t) * 255 * b);
            },
            _stroke: this._p5.color(255),
            _fill_weight:
            (t: number): number => {
                return this._p5.abs(this._p5.abs(this._p5.sin(t*this._p5.TWO_PI * 1 + this._p5.frameCount * 0.05)) * 16 + 0);
            },
            _stroke_weight: 2,
            _draw_caps: 0,
            _thickness: 6,
        };
    }

    draw() {
        this._p5.background(this._colors.bg);

        const mouse = this._world_transform.unapply(this._p5.createVector(this._p5.mouseX, this._p5.mouseY));
        const pmouse = this._world_transform.unapply(this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY));

        for (let i = 0; i < this._beziers.length; i++) {
            if (!this._beziers[i].hidden)
                drawBezierCurve(this._p5, this._world_transform, this._beziers[i], "t", this._interaction_vars, true);

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
            // let bb = getBoundingBox(this._p5, getCurve(this._p5, this._beziers[i]._anchors, 20));
            // if (!(this._active_bezier_mode === 0 && this._active_bezier > -1)&& pointInBox(this._p5, mouse, bb)) {
            //     bb.p1 = this._world_transform.apply(bb.p1);
            //     bb.p2 = this._world_transform.apply(bb.p2);
            //     this._p5.stroke(this._colors.fgd);
            //     this._p5.strokeWeight(2);
            //     this._p5.noFill();
            //     this._p5.rect(bb.p1.x, bb.p1.y, bb.p2.x-bb.p1.x, bb.p2.y-bb.p1.y);
            // }
        }
    }

    interact() {
        const mouse = this._world_transform.unapply(this._p5.createVector(this._p5.mouseX, this._p5.mouseY));
        const pmouse = this._world_transform.unapply(this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY));

        let potential_new_active_bezier = -1;

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

            if (this._p5.mouseIsPressed && !(this._active_bezier_mode === 0 && this._active_bezier > -1) && pointInBox(this._p5, mouse, getBoundingBox(this._p5, getCurve(this._p5, this._beziers[i]._anchors, 20)))) {
                potential_new_active_bezier = i;
            }
        }

        if (this._interaction_vars.defocus_all || this._active_bezier < 0) {
            this.ui.focus(potential_new_active_bezier, true);
            this._interaction_vars.grabbed = 8;
        }

        this._interaction_vars.defocus_all = false;

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
            this._world_transform.offset.y -= event.deltaY;
        }
    }
}