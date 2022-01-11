// implements functionality to render splines

function drawSpline(p5, anchors, resolution) {
  // Returns an array with  resolution + 1  elements
  let points = getSpline(p5, anchors, resolution);
  
  for (let i = 0; i < resolution; i++) {
  
    p5.stroke(60, 80, 255, 10);
    p5.strokeWeight(12);
    p5.line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
    p5.stroke(255);
    p5.strokeWeight(1);
    p5.line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
  }
}

function getSpline(p5, anchors, resolution) {
  let points = [];
  
  for (let i = 0; i < resolution + 1; i++) {
    let a = [...anchors];
    
    for (let p = anchors.length; p >= 0; p--) {
      for (let q = 0; q < p - 1; q++) {
        a[q] = a[q].copy().lerp(a[q+1], i / resolution);
      }
    }
    
    points.push(a[0]);
  }
  
  return points;
}

function normalizeCurve(p5, anchors, resolution = 100) {
	let curve = getSpline(p5, anchors, resolution);
	let sx = Infinity, sy = Infinity, bx = -Infinity, by = -Infinity;
	let aw, ah;

	for (let i = 0; i < curve.length; i++) {
		if (curve[i].x > bx) bx = curve[i].x;
		if (curve[i].y > by) by = curve[i].y;
		if (curve[i].x < sx) sx = curve[i].x;
		if (curve[i].y < sy) sy = curve[i].y;
	}
	aw = (bx-sx) / p5.max((bx-sx), (by-sy));
	ah = (by-sy) / p5.max((bx-sx), (by-sy));

	let norm_anchors = [];
	for (let i = 0; i < anchors.length; i++) {
		norm_anchors[i] = p5.createVector(
			aw * p5.map(anchors[i].x, sx, bx, 0, 1),
			ah * p5.map(anchors[i].y, sy, by, 0, 1)
		);
	}

	return {
		"anchors": norm_anchors
	}
}