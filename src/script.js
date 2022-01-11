// new p5(top_right_panel, "top-right-panel")

let top_right_panel_div = document.getElementById("top-right-panel");
new TopRightPanel(
    top_right_panel_div.offsetWidth, 
    top_right_panel_div.offsetHeight, 
    // window.innerWidth,
    // window.innerHeight,
    top_right_panel_div
)