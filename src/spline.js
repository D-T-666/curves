// implements functionality to render splines

function drawSpline(anchors, resolution, vars = {t: 4, s: 2, caps: 3, fill: colors.bg, stroke: color(80, 110, 255)}) {
  // Returns an array with  resolution + 1  elements
  let points = getSpline(anchors, resolution);
  
  let pp1, pp2, t = vars.t, s = vars.s;

  if (vars.caps & 1) {
    if (vars.stroke instanceof Function)
      stroke(vars.stroke(0))
    else
      stroke(vars.stroke);
    strokeWeight(s);
    noFill();
    arc(points[0].x, points[0].y, t, t, points[1].copy().sub(points[0]).normalize().heading() + HALF_PI, points[1].copy().sub(points[0]).normalize().heading() - HALF_PI)
  }
    
  for (let i = 0; i < resolution; i++) {
    colorMode(HSB);
    if (vars.fill instanceof Function)
      stroke(vars.fill(i / (resolution)))
    else
      stroke(vars.fill);
    strokeWeight(t-s);
    line(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
    colorMode(RGB);

    let p1, p2;
    if (i < resolution/2)
      p1 = points[i + 1].copy().sub(points[i]).normalize().rotate(HALF_PI).mult(t/2);
    else
      p1 = points[i].copy().sub(points[i-1]).normalize().rotate(HALF_PI).mult(t/2);
    p2 = p1.copy().rotate(PI);

    p1.add(points[i]);
    p2.add(points[i]);

    strokeWeight(s);
    if (vars.stroke instanceof Function)
      stroke(vars.stroke(i / (resolution)))
    else
      stroke(vars.stroke);
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
  p1 = points[resolution].copy().sub(points[resolution-1]).normalize().rotate(HALF_PI).mult(t/2);
  p2 = p1.copy().rotate(PI);
  p1.add(points[resolution]);
  p2.add(points[resolution]);
  line(p1.x, p1.y, pp1.x, pp1.y);
  line(p2.x, p2.y, pp2.x, pp2.y);

  noFill();
  if (vars.caps & 2)
  arc(points[resolution].x, points[resolution].y, t, t, points[resolution].copy().sub(points[resolution-1]).normalize().heading() - HALF_PI, points[resolution].copy().sub(points[resolution-1]).normalize().heading() + HALF_PI)

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
			aw * map(anchors[i].x, sx, bx, 0, 1) + (1 - aw) / 2,
			ah * map(anchors[i].y, sy, by, 0, 1) + (1 - ah) / 2
		);
	}

	return {
		anchors: norm_anchors,
    w: aw,
    h: ah
	}
}

function updateVars(spline) {
  if (!mouseIsPressed) spline.vars.grabbed_index = -1;

	spline.vars.click_timer--;
}