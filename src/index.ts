import * as p5 from "p5";
import './scss/style.scss';
import { Scene } from "./sketch/scene";
import { SidePanel } from "./ui/main";


new p5((p: p5): void => {
    let main_scene: Scene;
    let side_panel: SidePanel;

    p.setup = (): void => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        main_scene = new Scene(p);
        side_panel = new SidePanel(p, main_scene);
        main_scene.set_ui_callbacks(side_panel.scene_callbacks);
    }

    p.draw = (): void => {
        main_scene.interact();

        main_scene.draw();

        p.noStroke();
        p.fill(255, 0, 0);
        p.text(`fps: ${p.round(p.frameRate())}`, 0, 10);
    }

    p.doubleClicked = (): void => {
        main_scene.doubleClicked();
    }

    p.mouseWheel = (event: any): void => {
        main_scene.mousePan(event)
    }
});