let splines = [{shape: [], vars: {grabbed_index: -1}, active: true}];
let colors = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  // for (let i = 0; i < 10; i++)
  //   splines[0].shape.push(createVector(random(width), random(height)));

  loadFromLocalStorage();

  colors.bg = color(60, 50, 255);
  colors.bg = color(110, 60, 200);
  colors.bg = color(25, 14, 60);
}

function draw() {
  background(colors.bg);

  if (mouseIsPressed) {
    handleMouse(
      createVector(mouseX, mouseY),
      createVector(pmouseX, pmouseY)
    );
  } 
  
  for (let i = 0; i < splines.length; i++) {
    updateVars(splines[i]);

    if ((splines[i].vars.pchanged !== splines[i].vars.changed) && splines[i].vars.pchanged === true) {
      saveToLocalStorage();
    }

    if (splines[i].active) {
      drawAnchors(
        createVector(mouseX, mouseY),
        createVector(pmouseX, pmouseY),
        splines[i].shape,
        splines[i].vars
      );
      drawPreviewWindow(splines[i])
    }

    drawSpline(splines[i].shape, 300);
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
  let mouse = createVector(event.offsetX, event.offsetY);
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
    shape: spline.shape.map(elt => ({
      x: elt.x, 
      y: elt.y
    }))
  }));

  console.log(data);

  window.localStorage.setItem("curve-editor-splines", JSON.stringify(data));
}

function loadFromLocalStorage() {
  splines = JSON.parse(window.localStorage.getItem("curve-editor-splines"))
  .map(spline => ({ 
    shape: spline.shape.map(elt => createVector(elt.x, elt.y)),
    vars: {
      grabbed_index: -1
    },
    active: false
  }))

  splines[splines.length - 1].active = true;
}

function handleMouse(mouse, pmouse) {
  for (let i = 0; i < splines.length; i++) {
    interactAnchors(mouse, pmouse, splines[i].shape, splines[i].vars);
  }
}