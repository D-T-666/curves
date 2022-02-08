import * as p5 from "p5";
import "./scss/style.scss";
import { Scene } from "./sketch/scene/main";
import { SidePanel } from "./ui/main";

let side_panel: SidePanel;

new p5((p: p5): void => {
    let main_scene: Scene;

    p.setup = (): void => {
        p.createCanvas(p.windowWidth - 332, p.windowHeight);

        main_scene = new Scene(p);
        side_panel = new SidePanel(p, main_scene);
        main_scene.ui = side_panel.scene_callbacks;
    };

    p.draw = (): void => {
        main_scene.interact();

        main_scene.draw();

        p.noStroke();
        p.fill(255, 0, 0);
        p.text(`fps: ${p.round(p.frameRate())}`, 0, 10);
    };

    p.doubleClicked = (): void => {
        main_scene.doubleClicked();
    };

    p.mouseWheel = (event: any): void => {
        main_scene.mousePan(event);
    };
}, document.getElementById("p5-container"));
