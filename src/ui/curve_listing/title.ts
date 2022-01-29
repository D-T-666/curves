import { Scene } from "../../sketch/scene/main";

export const createCurveListingTitle = (curve_index: number, scene_ref: Scene): Element => {
    let title = document.createElement('textarea');

    title.classList.add('title');
    title.cols = 8;
    title.rows = 1;
    title.value = scene_ref._beziers[curve_index]._name;

    title.addEventListener('change', (e) => {
        scene_ref._beziers[curve_index]._name = title.value;
    })

    return title;
}