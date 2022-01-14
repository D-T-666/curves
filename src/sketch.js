let splines = [{shape: [], vars: {grabbed_index: -1}, active: true}];
let colors = {};

function setup() {
  createCanvas(windowWidth, windowHeight);

  loadFromLocalStorage();

  overlay(splines);

  colors.bg = color(60, 50, 255);
  colors.bg = color(110, 60, 200);
  colors.bg = color(25, 14, 60);
}

function draw() {
  background(colors.bg);

  if (mouseIsPressed) {
    if (mouseX >= 216 || mouseX <= 16 || mouseY >= height - 232 || mouseY <= 16)
    handleMouse(
      createVector(mouseX, mouseY),
      createVector(pmouseX, pmouseY)
    );
  } 
  
  for (let i = 0; i < splines.length-1; i++) {
    let a1 = splines[i].shape[splines[i].shape.length-1]
      .copy()
      .sub(splines[i].shape[splines[i].shape.length-2]);
    a1 = a1
      .mult(2000/a1.magSq())
      .add(splines[i].shape[splines[i].shape.length-1])
    let a2 = splines[i+1].shape[0]
      .copy()
      .sub(splines[i+1].shape[1])
    a2 = a2
      .mult(2000/a2.magSq())
      .add(splines[i+1].shape[0])


    drawSpline([
      splines[i].shape[splines[i].shape.length-1],
      a1,
      a2,
      splines[i+1].shape[0]
    ], 100, {
      t: 4, s: 2,
      fill: color(0,0),
      stroke: color(0, 255, 255, 40)
    })
  }

  for (let i = 0; i < splines.length; i++) {
    updateVars(splines[i]);

    if ((splines[i].vars.pchanged !== splines[i].vars.changed) && splines[i].vars.pchanged === true) {
      saveToLocalStorage();
    }

    drawSpline(splines[i].shape, splines[i].active ? 150 : 50, {
      t: 4,
      s: 2,
      fill: colors.bg,
      stroke: color(80, 110, 255, splines[i].active ? 255 : 32)
    });

    if (splines[i].active) {
      drawAnchors(
        createVector(mouseX, mouseY),
        createVector(pmouseX, pmouseY),
        splines[i].shape,
        splines[i].vars
      );
      drawPreviewWindow(splines[i])
    }
  }
}

function keyPressed() {
  if (key == " ") {
    console.log(JSON.stringify(splines.map(
      spl => {normalizeSpline(spl.shape).map(elt => ({
        x: elt.x, y: elt.y
      }))}
    )));
  }
}

function mouseWheel(event) {
  // console.log(event);
  let mouse = createVector(event.x, event.y);
  if (event.x >= 216 || event.x <= 16 || event.y >= height - 232 || event.y <= 16)
    splines.forEach(spline =>
      spline.shape.forEach(elt => {
        if (event.ctrlKey) {
          var s = Math.exp(-event.deltaY/100);
          elt.set(elt.copy().sub(mouse).mult(s).add(mouse));
        } else {
          elt.x -= event.deltaX;
          elt.y -= event.deltaY;
        }
      })
    )
}

function saveToLocalStorage() {
  let data = splines.map(spline => ({
    ...spline, 
    shape: spline.shape.map(elt => ({
      x: elt.x, 
      y: elt.y
    })),
    vars: {grabbed_index: -1}
  }));

  console.log(data);

  window.localStorage.setItem("curve-editor-splines", JSON.stringify(data));
}

function loadFromLocalStorage() {
  data = window.localStorage.getItem("curve-editor-splines");
  if (data !== null)
    splines = JSON.parse(data)
      .map(spline => ({ 
        ...spline,
        shape: spline.shape.map(elt => createVector(elt.x, elt.y)),
        vars: {
          grabbed_index: -1
        },
        active: false
      }))
  else
    for (let i = 0; i < 5; i++)
      splines[0].shape.push(createVector(random(width), random(height)));

  splines[splines.length - 1].active = true;
}

function handleMouse(mouse, pmouse) {
  for (let i = 0; i < splines.length; i++) {
    if (splines[i].active)
    interactAnchors(mouse, pmouse, splines[i].shape, splines[i].vars);
  }
}