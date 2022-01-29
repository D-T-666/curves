import { Scene } from "./main";

Scene.prototype.set_focus_mode = function (mode: "anchor-edit" | "transform") {
    this.focus_mode = ["anchor-edit", "transform"].indexOf(mode);
    console.log(this.focus_mode);
};

Scene.prototype.set_focus = function (index: number): boolean {
    if (index > -1) {
        if (
            this.focused_curves.length === 1 &&
            this.focused_curves[0] === index
        )
            return false;
        this.focused_curves = [index];
    } else {
        if (this.focused_curves.length === 0) return false;
        this.focused_curves = [];
    }
    return true;
};

Scene.prototype.get_focused = function (): number[] {
    return this.focused_curves;
};

Scene.prototype.is_focused = function (index: number): boolean {
    return this.focused_curves.includes(index);
};

Scene.prototype.add_focus = function (index: number): boolean {
    if (!this.focused_curves.includes(index)) {
        this.focused_curves.push(index);
        return true;
    } else {
        return false;
    }
};
