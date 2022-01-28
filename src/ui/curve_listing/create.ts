import { Scene } from "../../sketch/scene";
import { createCurveListingCheckbox } from "./checkbox";
import { createCurveListingTitle } from "./title";
import { createCurveListingToolBox } from "./toolbox/create";

export class CurveListing {
    scene_ref: Scene;
    curve_index: number;
    parent_callbacks: any;
    callbacks: any;
    element: Element;
    focused: boolean;
    ui: any;

    constructor(_scene_ref: Scene, _curve_index: number, _callbacks: any) {
        this.scene_ref = _scene_ref;
        this.curve_index = _curve_index;
        this.parent_callbacks = _callbacks;

        this.focused = this.scene_ref._active_bezier === this.curve_index;

        this.callbacks = {
            delete: (e: Event) => this.delete(e),
            duplicate: (e: Event) => this.duplicate(e),
            toggle_hide: () => this.toggle_hide(),
            move_up: (e: Event) => this.move_up(e),
            move_down: (e: Event) => this.move_down(e),
        }

        this.element = document.createElement('button');
    
        this.element.addEventListener('click', (e) => this.focus())
    
        this.element.classList.add('curve-listing');
    
        this.ui = {
            checkbox: createCurveListingCheckbox(!this.scene_ref._beziers[this.curve_index].hidden, this.callbacks.toggle_hide),
            title: createCurveListingTitle(this.curve_index, this.scene_ref),
            toolbox: createCurveListingToolBox(this.curve_index, this.scene_ref, this.callbacks),
        };
        this.element.appendChild(this.ui.checkbox);
        this.element.appendChild(this.ui.title);
        this.element.appendChild(this.ui.toolbox);

        this.ui.title.disabled = true;
    }

    unfocus() {
        this.ui.title.disabled = true;

        this.element.classList.remove('active')
    }

    focus() {
        this.parent_callbacks.focus(this.curve_index);

        this.element.classList.add('active')

        this.ui.title.disabled = false;
    }

    move_up(e: Event) {
        e.stopPropagation();

        this.parent_callbacks.rearrange(this.curve_index, -1);
    }

    move_down(e: Event) {
        e.stopPropagation();

        this.parent_callbacks.rearrange(this.curve_index, 1);
    }

    delete(e: Event) {
        e.stopPropagation();

        this.parent_callbacks.delete(this.curve_index);
    }

    duplicate(e: Event) {
        e.stopPropagation();

        this.parent_callbacks.duplicate(this.curve_index);
    }

    toggle_hide() {
        this.parent_callbacks.toggle_hide(this.curve_index);
    }

    getElement() {
        return this.element;
    }
}