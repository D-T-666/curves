import { Scene } from "./main";

Scene.prototype.set_focus_mode = function (mode: "anchor-edit" | "transform") {
    // Sets the focus mode index
    this.focus_mode = ["anchor-edit", "transform"].indexOf(mode);
};

Scene.prototype.set_focus = function (index: number): boolean {
    // Sets the only element of the focused_curves array to the given index
    // or clears the focused array if the given index is negative.

    // Returns false if no change is made.

    if (index > -1) {
        // If the index is non-negative
        if (
            this.focused_curves.length === 1 &&
            this.focused_curves[0] === index
        )
            // If the only element in the existing focused_curves
            // array is the same as the given index, return false
            return false;

        // Else, just set the only element of the focused_curves array
        // to the given index
        this.focused_curves = [index];
    } else {
        if (this.focused_curves.length === 0)
            // If the focused_curves array is already empty
            return false;

        // Else, clear it
        this.focused_curves = [];
    }

    // If we have not returned false, we should return
    // true, since we have made a change
    return true;
};

Scene.prototype.get_focused = function (): number[] {
    // Returns the array containing the indecies of the focused curves
    return this.focused_curves;
};

Scene.prototype.is_focused = function (index: number): boolean {
    // Returns a boolean specifying if the curve with the given index
    // is in the focused_curves array or not
    return this.focused_curves.includes(index);
};

Scene.prototype.add_focus = function (index: number): boolean {
    // Inserts the given index into the focused_curves array

    // Returns false if no change is made

    if (this.focused_curves.includes(index))
        // If the given index is already in the focused_curves array
        return false;

    // Else, insert the index and return true
    this.focused_curves.push(index);
    return true;
};
