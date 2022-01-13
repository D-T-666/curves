function drawPreviewWindow(spline) {
    stroke(255);
    strokeWeight(1);
    fill(255, 127);
    rect(16, height - 216, 200, 200);

    let anchors = normalizeSpline(spline.shape).anchors;
    // console.log(anchors)
    anchors = anchors.map(elt => elt.mult(160).add(36, height - 196));

    drawSpline(anchors, 100, {
        t: 14,
        s: 2,
        fill: color(127),
        stroke: color(0)
    })
}