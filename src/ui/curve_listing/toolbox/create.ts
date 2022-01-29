import { Scene } from "../../../sketch/scene/main";

// export const createEditButton = (curve_index: number, scene_ref: Scene): Element

export const createCurveListingToolBox = (callbacks: any): Element => {
    let toolbox = document.createElement("div");

    toolbox.classList.add("toolbox");

    /* Create Edit Button */ {
        let edit_button_div = document.createElement("div");
        let edit_button = document.createElement("button");

        edit_button.innerText = "🖋";

        edit_button.addEventListener("click", callbacks.anchor_edit);

        edit_button_div.appendChild(edit_button);

        toolbox.appendChild(edit_button_div);
    }
    /* Create duplicate Button */ {
        let duplicate_button_div = document.createElement("div");
        let duplicate_button = document.createElement("button");

        duplicate_button.innerText = "📋";

        duplicate_button.addEventListener("click", callbacks.duplicate);

        duplicate_button_div.appendChild(duplicate_button);

        toolbox.appendChild(duplicate_button_div);
    }
    /* Create delete Button */ {
        let delete_button_div = document.createElement("div");
        let delete_button = document.createElement("button");

        delete_button.innerText = "🗑";

        delete_button.addEventListener("click", callbacks.delete);

        delete_button_div.appendChild(delete_button);

        toolbox.appendChild(delete_button_div);
    }
    /* Create arrangement Buttons */ {
        let arrangement_buttons_div = document.createElement("div");
        let up_button = document.createElement("button");
        let down_button = document.createElement("button");

        up_button.innerText = "↑";
        down_button.innerText = "↓";

        up_button.addEventListener("click", callbacks.move_up);
        down_button.addEventListener("click", callbacks.move_down);

        arrangement_buttons_div.appendChild(up_button);
        arrangement_buttons_div.appendChild(down_button);

        toolbox.appendChild(arrangement_buttons_div);
    }

    return toolbox;
};
