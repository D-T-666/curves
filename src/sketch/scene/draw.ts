import { drawBezierAnchors } from "../draw/anchors";
import { drawBezierCurve } from "../draw/bezier";
import { drawBoundingBox } from "../draw/boundingBox";
import { Scene } from "./main";

Scene.prototype.draw = function () {
    this._p5.background(this._colors.bg);

    const mouse = this._world_transform.unapply(
        this._p5.createVector(this._p5.mouseX, this._p5.mouseY),
    );
    const pmouse = this._world_transform.unapply(
        this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY),
    );

    for (let i = 0; i < this._beziers.length; i++) {
        if (!this._beziers[i].hidden)
            drawBezierCurve(
                this._p5,
                this._world_transform,
                this._beziers[i],
                "t",
                this._interaction_vars,
                true,
            );

        if (this.focused_curves.includes(i)) {
            switch (this.focus_mode) {
                case 0:
                    drawBezierAnchors(
                        this._p5,
                        this._world_transform,
                        this._beziers[i],
                        mouse,
                        pmouse,
                        this._colors,
                    );
                    break;
                case 1:
                    drawBoundingBox(
                        this._p5,
                        this._world_transform,
                        this._beziers[i],
                        mouse,
                        pmouse,
                        this._colors,
                        this._interaction_vars,
                    );
                    break;
            }
        }
    }
    this._interaction_vars.pmouseIsPressed = this._p5.mouseIsPressed;
};
