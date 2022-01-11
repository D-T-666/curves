class TopRightPanel{
  constructor(_width, _height, parent_div) {
    new p5(
      function top_right_panel(p5) {
        let _default_spline = [];

        let splines = [];

        p5.setup = () => {
          console.log({_width, _height});
          p5.createCanvas(_width, _height);
          // p5.pixelDensity(1);
          _default_spline.push(p5.createVector(p5.width / 2 - 200 + 110, p5.height / 2 - 200 + 250));
          _default_spline.push(p5.createVector(p5.width / 2 - 200 + 390, p5.height / 2 - 200 + 100));
          _default_spline.push(p5.createVector(p5.width / 2 - 200 + 10 , p5.height / 2 - 200 + 100));
          _default_spline.push(p5.createVector(p5.width / 2 - 200 + 290, p5.height / 2 - 200 + 250));

          splines.push(_default_spline);
        }

        p5.draw = () => {
          p5.background(60, 50, 255);

          for (let i = 0; i < splines.length; i++) {
            handleAnchors(p5, splines[i]);
            
            drawSpline(p5, splines[i], 150);
          }
        }

        p5.keyPressed = () => {
          if (p5.key == " ") {
            vecs = splines.map(normalizeSpline);
            console.log(JSON.stringify(vecs.map(
              spl => {anchors: spl.anchors.map(elt => ({
                x: elt.x, y: elt.y
              }))}
            )));
          }
        }

        p5.drawRepeatingCurveBackground = (curve) => {
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

          let norm = [];
          for (let i = 0; i < curve.length; i++) {
            norm[i] = p5.createVector(
              p5.map(curve[i].x, sx, bx, 0, 1),
              p5.map(curve[i].y, sy, by, 0, 1)
            );
          }

          let scl = 100;

          for (let y = 0; y < height; y += scl * ah) {
            for (let x = 0; x < width; x += scl * aw) {
              let pi = 0
              for (let i = 0; i < curve.length - 2; i += 2) {
                p5.stroke(22, 22, 44, 40);
                p5.strokeWeight(2);
                p5.line(
                  x + scl * aw * norm[i].x,
                  y + scl * ah * norm[i].y,
                  x + scl * aw * norm[pi].x,
                  y + scl * ah * norm[pi].y);
                pi = i;
              }
              p5.line(
                x + scl * aw * norm[pi].x,
                y + scl * ah * norm[pi].y,
                x + scl * aw * norm[norm.length-1].x,
                y + scl * ah * norm[norm.length-1].y);
            }
          }
        }
      },
      parent_div
    )
  }
}