import { pointInBox, getBoundingBox } from "../../utils/points";
import { getCurve } from "../getCurve";
import { interactAnchors } from "../interact/anchors";
import { interactBoundingBox } from "../interact/boundingBox";
import { Scene } from "./main";

// TODO: refactor this file

Scene.prototype.interact = function () {
    const mouse = this._world_transform.unapply(
        this._p5.createVector(this._p5.mouseX, this._p5.mouseY),
    );
    const pmouse = this._world_transform.unapply(
        this._p5.createVector(this._p5.pmouseX, this._p5.pmouseY),
    );

    let potential_new_active_bezier = -1;

    for (let i = 0; i < this._beziers.length; i++) {
        if (this.focused_curves.includes(i)) {
            switch (this.focus_mode) {
                case 0:
                    interactAnchors(
                        this._p5,
                        this._world_transform,
                        this._beziers[i],
                        mouse,
                        pmouse,
                        this._interaction_vars,
                    );
                    break;
                case 1:
                    interactBoundingBox(
                        this._p5,
                        this._world_transform,
                        this._beziers[i],
                        mouse,
                        pmouse,
                        this._interaction_vars,
                    );
                    break;
            }
        }

        if (
            this._p5.mouseIsPressed &&
            !(this.focus_mode === 0 && this.focused_curves.length > 0) &&
            pointInBox(
                this._p5,
                mouse,
                getBoundingBox(
                    this._p5,
                    getCurve(this._p5, this._beziers[i]._anchors, 20),
                ),
            )
        ) {
            potential_new_active_bezier = i;
        }
    }

    if (
        this._interaction_vars.defocus_all ||
        this.focused_curves.length === 0
    ) {
        this._ui.focus(potential_new_active_bezier, true);
        this._interaction_vars.grabbed = 8;
    }

    if (this._interaction_vars.change_mode) {
        this.focus_mode = 1 - this.focus_mode;
        this._interaction_vars.change_mode = false;
    }

    this._interaction_vars.defocus_all = false;
    this._interaction_vars.doubleClicked = false;
};

Scene.prototype.doubleClicked = function () {
    this._interaction_vars.doubleClicked = true;
};

Scene.prototype.mousePan = function (event: any) {
    if (
        event.x >= 316 ||
        event.x <= 16 ||
        event.y >= this._p5.height - 232 ||
        event.y <= 16
    )
        if (event.ctrlKey) {
            this._world_transform.scale *= Math.exp(-event.deltaY / 100);
        } else {
            this._world_transform.offset.x -= event.deltaX;
            this._world_transform.offset.y -= event.deltaY;
        }
};
