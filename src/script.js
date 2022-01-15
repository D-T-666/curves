const ui = {
    createToolBoxButton: (text, click_event_listener) => {
        let button = document.createElement("button");
        button.innerText = text;
        button.classList.add(text);

        if (click_event_listener)
            button.addEventListener("click", click_event_listener);

        return button;
    },

    createSplineListingToolboxRightPane: (i) => {
        let right_pane = document.createElement("div");
        right_pane.classList.add("right");

        if (i > 0)
            right_pane.appendChild(
                ui.createToolBoxButton("up", (e) => {
                    [ splines[i], splines[i-1] ] = [ splines[i-1], splines[i] ];
                    saveToLocalStorage();
                    location.reload();
                })
            );

        right_pane.appendChild(
            ui.createToolBoxButton("reverse", (e) => {
                splines[i].shape = splines[i].shape.reverse();
                saveToLocalStorage();
            })
        );

        if (i < splines.length-1)
            right_pane.appendChild(
                ui.createToolBoxButton("down", (e) => {
                    [ splines[i], splines[i+1] ] = [ splines[i+1], splines[i] ];
                    saveToLocalStorage();
                    location.reload();
                })
            );
        
        return right_pane;
    },

    createSplineListingToolboxLeftPane: (i) => {
        let left_pane = document.createElement("div");
        left_pane.classList.add("left");

        left_pane.appendChild(
            ui.createToolBoxButton("delete", (e) => {
                splines.splice(i, 1);
                saveToLocalStorage();
                location.reload();
            })
        );

        left_pane.appendChild(
            ui.createToolBoxButton("duplicate", (e) => {
                splines.splice(i, 0, splines[i]);
                saveToLocalStorage();
                location.reload();
            })
        );
        
        return left_pane;
    },

    createSplineListingToolbox: (i) => {
        // Tool box div
        let p = document.createElement("div");
        p.classList.add("tool-box");

        p.appendChild(ui.createSplineListingToolboxLeftPane(i));
        p.appendChild(ui.createSplineListingToolboxRightPane(i));

        return p;
    },

    createSplineListingTitle: (title, change_event_listener) => {
        let listing_title = document.createElement("textarea");
        listing_title.value = title;

        listing_title.addEventListener("change", change_event_listener);

        return listing_title;
    },

    createSplinelisting: (i) => {
        let listing_div = document.createElement("div");
        listing_div.id = `spline-${i}`;

        listing_div.classList.add("spline-listing");
        if (splines[i].active)
            listing_div.classList.add("active");

        listing_div.addEventListener("click", (e) => {
            for (let k = 0; k < splines.length; k++)
                if (splines[k].active) {
                    splines[k].active = false;
                    document.getElementById(`spline-${k}`).classList.remove("active")
                }
            splines[i].active = true;
            document.getElementById(`spline-${i}`).classList.add("active");
        })

        // assemble elements together
        listing_div.appendChild(
            ui.createSplineListingTitle(
                splines[i].name || `spline #${i+1}`,
                (e) => {
                    splines[i].name = e.target.value;
                    saveToLocalStorage();
                }
            )
        );
        listing_div.appendChild(ui.createSplineListingToolbox(i));

        return listing_div;
    },

    createSpacerElement: () => {
        let spacer = document.createElement("div");
        spacer.classList.add("spacer");

        return spacer;s
    },

    createNewSplineButton: () => {
        let new_button = document.createElement("button");
        new_button.innerText = "+ new spline";
        new_button.classList.add("new-spline");

        new_button.addEventListener("click", () => {
            splines.push({
                shape: [],
                vars: {grabbed_index: -1},
                active: false
            })

            for (let i = 0; i < 3; i++) {
                splines[splines.length - 1].shape.push(
                    createVector(random(width), random(height))
                );
            }

            saveToLocalStorage();

            location.reload();
        });

        return new_button;
    }
};

function overlay(splines) {
    let overlayDiv = document.getElementById("overlay");

    // for (let k = 0; k < 100; k++)
    for (let i = 0; i < splines.length; i++) {
        overlayDiv.appendChild(ui.createSplinelisting(i));
    }

    overlayDiv.appendChild(ui.createSpacerElement())

    overlayDiv.appendChild(ui.createNewSplineButton())
}