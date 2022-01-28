import p5 = require("p5");
import { createBezier } from "../sketch/bezier";
import { Scene } from "../sketch/scene";
import { createNewCurveButton } from "./createNewCurveButton";
import { createCurveListing } from "./curve_listing/create";

export class SidePanel {
    ui: any;
    previous_listings: any;
    scene_ref: Scene;
    p5: p5;
    side_panel_div: Element
    listing_callbacks: any;

    constructor(p: p5, _scene_ref: Scene) {
        this.scene_ref = _scene_ref;
        this.p5 = p;

        this.ui = {
            curveListings: []
        }

        this.listing_callbacks = {
            delete: (index: number) => this.deleteListing(index),
            duplicate: (index: number) => this.duplicateListing(index)
        };

        this.previous_listings = [];

        this.side_panel_div = document.getElementById('side-panel');

        this.updateListings();

        this.ui.newCurveButton = createNewCurveButton(this.p5, (e) => this.createNewListing());
        this.side_panel_div.appendChild(this.ui.newCurveButton);
    }

    // hideListing(index: number) {
    //     this.scene_ref._beziers[index].hidden = 
    // }

    deleteListing(index: number) {
        this.side_panel_div.removeChild(this.ui.curveListings[index]);
        this.ui.curveListings.splice(index, 1);
        this.scene_ref._beziers.splice(index, 1);
    }

    duplicateListing(index: number) {
        this.scene_ref._beziers.splice(index + 1, 0, {...this.scene_ref._beziers[index]});

        this.insertListing(createCurveListing(index + 1, this.scene_ref, this.listing_callbacks), index + 1);
    }

    createNewListing(index?: number): any {
        this.scene_ref.createNewCurve(prompt('name for the new curve'));

        let listing = createCurveListing(this.scene_ref._beziers.length - 1, this.scene_ref, this.listing_callbacks);

        this.insertListing(listing);
    }

    insertListing(listing: any, index?: number): any {
        if (index && index < this.ui.curveListings.length)
            this.side_panel_div.insertBefore(listing, this.ui.curveListings[index]);
        else
            this.side_panel_div.insertBefore(listing, this.ui.newCurveButton);

        this.ui.curveListings.push(listing);
    }

    updateListings() {
        for (let i = 0; i < this.scene_ref._beziers.length; i++) {
            // if (this.previous_listings[i] !== this.scene_ref._beziers[i]) {
                this.previous_listings[i] = this.scene_ref._beziers[i];

                let listing = createCurveListing(i, this.scene_ref, this.listing_callbacks);
                this.side_panel_div.appendChild(listing);
                this.ui.curveListings.push(listing);
            // }
        }
    }
}