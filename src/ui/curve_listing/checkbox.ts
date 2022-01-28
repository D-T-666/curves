import { Scene } from "../../sketch/scene";

export const createCurveListingCheckbox = (curve_index: number, scene_ref: Scene, callback: (e:Event) => {}): Element => {
    let checkbox = document.createElement('input');

    checkbox.classList.add('show-hide-curve');
    checkbox.type = 'checkbox';
    checkbox.checked = !scene_ref._beziers[curve_index].hidden;

    checkbox.addEventListener('change', callback)

    return checkbox;
}