let _default_spline = [];

let splines = [];

let background_spline = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  _default_spline.push(createVector(width / 2 - 200 + 110, height / 2 - 200 + 250));
  _default_spline.push(createVector(width / 2 - 200 + 390, height / 2 - 200 + 100));
  _default_spline.push(createVector(width / 2 - 200 + 10 , height / 2 - 200 + 100));
  _default_spline.push(createVector(width / 2 - 200 + 290, height / 2 - 200 + 250));
  // background_spline = getSpline(main_spline, 50);

  splines.push(_default_spline);
}

function draw() {
  background(60, 50, 255);

  // if(frameCount % 10 == 0)
  //   background_spline = getSpline(main_spline, 50);

  // drawRepeatingCurveBackground(background_spline);
  
  for (let i = 0; i < splines.length; i++) {
    handleAnchors(splines[i]);
    
    drawSpline(splines[i], 150);
  }
}

function keyPressed() {
  if (key == " ") {
    vecs = splines.map(normalizeSpline);
    console.log(JSON.stringify(vecs.map(
      spl => {anchors: spl.anchors.map(elt => ({
        x: elt.x, y: elt.y
      }))}
    )));
  }
}

function drawRepeatingCurveBackground(curve) {
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

  let norm = [];
  for (let i = 0; i < curve.length; i++) {
    norm[i] = createVector(
      map(curve[i].x, sx, bx, 0, 1),
      map(curve[i].y, sy, by, 0, 1)
    );
  }

  let scl = 100;

  for (let y = 0; y < height; y += scl * ah) {
    for (let x = 0; x < width; x += scl * aw) {
      let pi = 0
      for (let i = 0; i < curve.length - 2; i += 2) {
        stroke(22, 22, 44, 40);
        strokeWeight(2);
        line(
          x + scl * aw * norm[i].x,
          y + scl * ah * norm[i].y,
          x + scl * aw * norm[pi].x,
          y + scl * ah * norm[pi].y);
        pi = i;
      }
      line(
        x + scl * aw * norm[pi].x,
        y + scl * ah * norm[pi].y,
        x + scl * aw * norm[norm.length-1].x,
        y + scl * ah * norm[norm.length-1].y);
    }
  }
}