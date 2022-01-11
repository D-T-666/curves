// implements functionality to render splines

function drawSpline(anchors, resolution) {
  // Returns an array with  resolution + 1  elements
  let points = getSpline(anchors, resolution);
  
  let pp1, pp2, s = 24;

  strokeWeight(4);
  stroke(0);
  noFill();
  arc(points[0].x, points[0].y, s, s, points[1].copy().sub(points[0]).normalize().heading() + HALF_PI, points[1].copy().sub(points[0]).normalize().heading() - HALF_PI)
    
  for (let i = 0; i < resolution; i++) {
    stroke(map(i, 0, resolution, 192, 255), map(i, 0, resolution, 128, 255), map(i, 0, resolution, 255, 192));
    stroke(map(i, 0, resolution, 224, 255), map(i, 0, resolution, 96, 208), map(i, 0, resolution, 224, 128));
    stroke(map(i, 0, resolution, 96, 208), map(i, 0, resolution, 224, 128), map(i, 0, resolution, 224, 255));
    // stroke(60, 50, 255);
    strokeWeight(s-4);
    line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );

    let p1, p2;
    if (i < resolution/2)
      p1 = points[i + 1].copy().sub(points[i]).normalize().rotate(HALF_PI).mult(s/2);
    else
      p1 = points[i].copy().sub(points[i-1]).normalize().rotate(HALF_PI).mult(s/2);
    p2 = p1.copy().rotate(PI);

    p1.add(points[i]);
    p2.add(points[i]);

    strokeWeight(4);
    stroke(0);
    // line(
    //   points[i].x,
    //   points[i].y,
    //   points[i + 1].x,
    //   points[i + 1].y,
    // );

    if (pp1) {
      line(p1.x, p1.y, pp1.x, pp1.y);
      line(p2.x, p2.y, pp2.x, pp2.y);
    }

    pp1 = p1;
    pp2 = p2;
  }
  let p1, p2;
  p1 = points[resolution].copy().sub(points[resolution-1]).normalize().rotate(HALF_PI).mult(s/2);
  p2 = p1.copy().rotate(PI);
  p1.add(points[resolution]);
  p2.add(points[resolution]);
  line(p1.x, p1.y, pp1.x, pp1.y);
  line(p2.x, p2.y, pp2.x, pp2.y);

  noFill();
  arc(points[resolution].x, points[resolution].y, s, s, points[resolution].copy().sub(points[resolution-1]).normalize().heading() - HALF_PI, points[resolution].copy().sub(points[resolution-1]).normalize().heading() + HALF_PI)

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

function normalizeSpline(anchors, resolution = 100) {
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