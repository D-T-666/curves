function drawPreviewWindow(spline) {
    stroke(colors.fg);
    strokeWeight(1);
    noFill();
    // fill(255, 127);
    rect(16, height - 216, 200, 200);

    let anchors = normalizeSpline(spline.shape).anchors;
    // console.log(anchors)
    anchors = anchors.map(elt => elt.mult(160).add(36, height - 196));

    drawSpline(anchors, 100, {
        t: 14,
        s: 1,
        fill: (t) => (
            color(t*127+127, t*100 + (1-t)*50, (1-t)*127+127)
        ),
        stroke: color(0,0)
    })
}