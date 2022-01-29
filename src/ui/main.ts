import p5 = require("p5");
import { copyBezier } from "../sketch/bezier";
import { Scene } from "../sketch/scene";
import { swap } from "../utils/array";
import { createNewCurveButton } from "./createNewCurveButton";
import { CurveListing } from "./curve_listing/create";

export class SidePanel {
    ui: any;
    previous_listings: any;
    scene_ref: Scene;
    p5: p5;
    side_panel_div: Element
    listing_callbacks: any;
    scene_callbacks: any;

    constructor(p: p5, _scene_ref: Scene) {
        this.scene_ref = _scene_ref;
        this.p5 = p;

        this.ui = {
            curve_listings: []
        }

        this.listing_callbacks = {
            delete: (index: number) => this.deleteListing(index),
            duplicate: (index: number) => this.duplicateListing(index),
            toggle_hide: (index: number) => this.toggleHideListing(index),
            rearrange: (index: number, direciton: number) => this.rearrange_listing(index, direciton),
            focus: (index: number) => this.focus(index, true),
        };

        this.scene_callbacks = {
            focus: (index: number, defocus_others: boolean) => this.focus(index, defocus_others)
        }

        this.previous_listings = [];

        this.side_panel_div = document.getElementById('side-panel');
        this.side_panel_div.addEventListener('click', (e) => e.stopPropagation())

        for (let i = 0; i < this.scene_ref._beziers.length; i++) {
            this.previous_listings[i] = this.scene_ref._beziers[i];

            let listing = new CurveListing(this.scene_ref, i, this.listing_callbacks);
            this.side_panel_div.appendChild(listing.getElement());
            this.ui.curve_listings.push(listing);
        }

        this.ui.newCurveButton = createNewCurveButton(this.p5, (e) => this.createNewListing());
        this.side_panel_div.appendChild(this.ui.newCurveButton);
    }

    focus(index: number, defocus_others?: boolean) {
        if (index !== this.scene_ref._active_bezier) {
            console.log()
            if (defocus_others && this.scene_ref._active_bezier >= 0 && this.scene_ref._active_bezier < this.scene_ref._beziers.length)
                this.ui.curve_listings[this.scene_ref._active_bezier].unfocus();
            if (defocus_others && index >= 0 && index < this.scene_ref._beziers.length)
                this.ui.curve_listings[index].focus(true);
            this.scene_ref.focus(index);
        }
    } 

    rearrange_listing(index: number, direction: number) {
        if (index + direction >= 0 && index + direction < this.ui.curve_listings.length) {
            this.side_panel_div.removeChild(this.ui.curve_listings[index].getElement());

            if (direction === -1) {
                this.side_panel_div.insertBefore(this.ui.curve_listings[index].getElement(), this.ui.curve_listings[index - 1].getElement())
            } else {
                if (index + 2 < this.ui.curve_listings.length)
                    this.side_panel_div.insertBefore(this.ui.curve_listings[index].getElement(), this.ui.curve_listings[index + 2].getElement())
                else
                    this.side_panel_div.insertBefore(this.ui.curve_listings[index].getElement(), this.ui.newCurveButton)
            }
            swap(this.scene_ref._beziers, index, index + direction);
            swap(this.ui.curve_listings, index, index + direction);
        }
        this.updateListings();
    } 

    toggleHideListing(index: number) {
        this.scene_ref._beziers[index].hidden = !this.scene_ref._beziers[index].hidden;
    }

    deleteListing(index: number) {
        this.scene_ref._beziers.splice(index, 1);
        this.removeListing(index);
    }

    duplicateListing(index: number) {
        let new_curve = copyBezier(this.scene_ref._beziers[index]);
        this.scene_ref._beziers.splice(index + 1, 0, new_curve);

        console.log(this.scene_ref._beziers)

        this.insertListing(new CurveListing(this.scene_ref, index + 1, this.listing_callbacks), index + 1);
    }

    createNewListing(index?: number): any {
        this.scene_ref.createNewCurve(prompt('name for the new curve'));

        let listing = new CurveListing(this.scene_ref, this.scene_ref._beziers.length - 1, this.listing_callbacks);

        this.insertListing(listing);
    }

    insertListing(listing: CurveListing, index?: number): any {
        if (index && index < this.ui.curve_listings.length) {
            this.side_panel_div.insertBefore(listing.getElement(), this.ui.curve_listings[index].getElement());
            this.ui.curve_listings.splice(index, 0, listing);
        } else {
            this.side_panel_div.insertBefore(listing.getElement(), this.ui.newCurveButton);
            this.ui.curve_listings.push(listing);
        }

        this.updateListings();
    }

    removeListing(index: number): any {
        this.side_panel_div.removeChild(this.ui.curve_listings[index].getElement());
        this.ui.curve_listings.splice(index, 1);

        this.updateListings();
    }

    updateListings() {
        for (let i = 0; i < this.ui.curve_listings.length; i++) {
            this.ui.curve_listings[i].curve_index = i;
        }
    }
}