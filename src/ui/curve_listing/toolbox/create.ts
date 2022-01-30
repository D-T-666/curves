function createButtonCollumn(
    buttons: { text: string; callback: (e: Event) => any }[],
): Element {
    let container_div = document.createElement("div");

    for (let btn of buttons) {
        let button = document.createElement("button");

        button.innerText = btn.text;

        button.addEventListener("click", btn.callback);

        container_div.appendChild(button);
    }

    return container_div;
}

export const createCurveListingToolBox = (callbacks: {
    [key: string]: (e: Event) => any;
}): Element => {
    let toolbox = document.createElement("div");

    toolbox.classList.add("toolbox");

    let button_collumns = [
        [{ text: "🖋", callback: callbacks.anchor_edit }],
        [{ text: "📋", callback: callbacks.duplicate }],
        [{ text: "🗑", callback: callbacks.delete }],
        [
            { text: "↑", callback: callbacks.move_up },
            { text: "↓", callback: callbacks.move_down },
        ],
    ];

    for (let button_collumn of button_collumns)
        toolbox.appendChild(createButtonCollumn(button_collumn));

    return toolbox;
};
