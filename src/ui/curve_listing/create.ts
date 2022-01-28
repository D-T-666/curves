import { Scene } from "../../sketch/scene";
import { createCurveListingCheckbox } from "./checkbox";
import { createCurveListingTitle } from "./title";
import { createCurveListingToolBox } from "./toolbox/create";

export const createCurveListing = (curve_index: number, scene_ref: Scene, callbacks: any): Element => {
    let listing = document.createElement('div');

    listing.classList.add('curve-listing');

    listing.appendChild(createCurveListingCheckbox(curve_index, scene_ref, callbacks.hide));
    listing.appendChild(createCurveListingTitle(curve_index, scene_ref));
    listing.appendChild(createCurveListingToolBox(curve_index, scene_ref, callbacks));

    return listing;
};