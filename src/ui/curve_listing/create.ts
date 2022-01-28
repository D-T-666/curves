import { Scene } from "../../sketch/scene";
import { createCurveListingCheckbox } from "./checkbox";
import { createCurveListingTitle } from "./title";
import { createCurveListingToolBox } from "./toolbox/create";

export class CurveListing {
    scene_ref: Scene;
    curve_index: number;
    parent_callbacks: any;
    callbacks: any;
    element: Element

    constructor(_scene_ref: Scene, _curve_index: number, _callbacks: any) {
        this.scene_ref = _scene_ref;
        this.curve_index = _curve_index;
        this.parent_callbacks = _callbacks;

        this.callbacks = {
            delete: () => this.delete(),
            duplicate: () => this.duplicate(),
            toggle_hide: () => this.toggle_hide(),
            move_up: () => this.move_up(),
            move_down: () => this.move_down(),
        }

        this.element = document.createElement('div');
    
        this.element.classList.add('curve-listing');
    
        this.element.appendChild(createCurveListingCheckbox(!this.scene_ref._beziers[this.curve_index].hidden, this.callbacks.toggle_hide));
        this.element.appendChild(createCurveListingTitle(this.curve_index, this.scene_ref));
        this.element.appendChild(createCurveListingToolBox(this.curve_index, this.scene_ref, this.callbacks));
    }

    move_up() {
        this.parent_callbacks.rearrange(this.curve_index, -1);
    }

    move_down() {
        this.parent_callbacks.rearrange(this.curve_index, 1);
    }

    delete() {
        this.parent_callbacks.delete(this.curve_index);
    }

    duplicate() {
        this.parent_callbacks.duplicate(this.curve_index);
    }

    toggle_hide() {
        this.parent_callbacks.toggle_hide(this.curve_index);
    }

    getElement() {
        return this.element;
    }
}