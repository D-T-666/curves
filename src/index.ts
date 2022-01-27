import * as p5 from "p5";
import './scss/style.scss';
import { Scene } from "./sketch/scene";

new p5((p: p5): void => {
    let main_scene: Scene;

    p.setup = (): void => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        main_scene = new Scene(p);
    }

    p.draw = (): void => {
        main_scene.interact();

        main_scene.draw();

        p.noStroke();
        p.fill(255, 0, 0);
        p.text(`double click to switch modes. fps:${p.round(p.frameRate())}`, 0, 10);
    }

    p.doubleClicked = (): void => {
        main_scene.doubleClicked();
    }

    p.mouseWheel = (event: any): void => {
        main_scene.mousePan(event)
    }
});