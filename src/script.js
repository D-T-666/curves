const ui = {
    createSplineListingToolbox: (i) => {
        // Tool box div
        let p = document.createElement("div");
        p.classList.add("tool-box");

        // up button
        let a = document.createElement("button");
        a.classList.add("up");
        a.innerText = "up";

        // reverse button
        let b = document.createElement("button");
        b.classList.add("re");
        b.innerText = "reverse";
        
        // up button
        let c = document.createElement("button");
        c.classList.add("dw");
        c.innerText = "down";


        a.addEventListener("click", (e) => {
            [ splines[i], splines[i-1] ] = [ splines[i-1], splines[i] ];
            saveToLocalStorage();
            location.reload();
            // let q = document.getElementById(`spline-${i}`);
            // let p = document.getElementById(`spline-${i-1}`);
            // document.getElementById("overlay").removeChild(q);
            // document.getElementById("overlay").insertBefore(q, p);
        }, false);

        b.addEventListener("click", (e) => {
            splines[i].shape = splines[i].shape.reverse();
            saveToLocalStorage();
        })

        c.addEventListener("click", (e) => {
            [ splines[i], splines[i+1] ] = [ splines[i+1], splines[i] ];
            saveToLocalStorage();
            location.reload();
        }, false);
        


        if (i > 0) p.appendChild(a);
        p.appendChild(b);
        if (i < splines.length-1) p.appendChild(c);

        return p;
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
            document.getElementById(`spline-${i}`).classList.add("active"), false
        })

        // The title of the spline
        let listing_title = document.createElement("textarea");
        listing_title.value = splines[i].name ? splines[i].name : `spline #${i+1}`;
        // listing_title.cols = 15;

        listing_title.addEventListener("change", (e) => {
            splines[i].name = e.target.value;
            saveToLocalStorage()
            console.log(e)
        })

        // Tool box
        let tool_box = ui.createSplineListingToolbox(i);


        // assemble elements together
        listing_div.appendChild(listing_title);
        listing_div.appendChild(tool_box);

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