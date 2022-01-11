// implements functionality to render splines

function drawSpline(anchors, resolution) {
  // Returns an array with  resolution + 1  elements
  let points = getSpline(anchors, resolution);
  
  for (let i = 0; i < resolution; i++) {
  
    stroke(255, 10);
    strokeWeight(12);
    line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
    stroke(255);
    strokeWeight(1);
    line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
  }
}

function getSpline(anchors, resolution) {
  let points = [];
  
  for (let i = 0; i < resolution + 1; i++) {
    let a = [...anchors];
    
    for (let p = anchors.length; p >= 0; p--) {
      for (let q = 0; q < p - 1; q++) {
        a[q] = p5.Vector.lerp(a[q], a[q+1], i / resolution);
      }
    }
    
    points.push(a[0]);
  }
  
  return points;
}

function normalizeCurve(anchors, resolution = 100) {
	let curve = getSpline(anchors, resolution);
	let sx = Infinity, sy = Infinity, bx = -Infinity, by = -Infinity;
	let aw, ah;

	for (let i = 0; i < curve.length; i++) {
		if (curve[i].x > bx) bx = curve[i].x;
		if (curve[i].y > by) by = curve[i].y;
		if (curve[i].x < sx) sx = curve[i].x;
		if (curve[i].y < sy) sy = curve[i].y;
	}
	aw = (bx-sx) / max((bx-sx), (by-sy));
	ah = (by-sy) / max((bx-sx), (by-sy));

	let norm_anchors = [];
	for (let i = 0; i < anchors.length; i++) {
		norm_anchors[i] = createVector(
			aw * map(anchors[i].x, sx, bx, 0, 1),
			ah * map(anchors[i].y, sy, by, 0, 1)
		);
	}

	return {
		"anchors": norm_anchors
	}
}