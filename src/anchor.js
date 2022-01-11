function drawAnchors(p5, anchors, vars) {
  const r = 5;

  let mouse_on_anchor = false;
  
  for (let i = 0; i < anchors.length; i++) {
    const is_hovering = p5.dist(p5.mouseX, p5.mouseY, anchors[i].x, anchors[i].y) < r * 1.4141;
    mouse_on_anchor |= is_hovering;

    p5.push();
    
    p5.noStroke();
    p5.fill(255, 180)
    
    p5.translate(anchors[i].x, anchors[i].y);
    if (is_hovering) {
      if (vars.click_timer > 0 && vars.last_clicked_index === i)
        p5.fill(255, 0, 0, 210); 
      p5.rotate(p5.QUARTER_PI);
      p5.rect(-r, -r, r*2, r*2);
    } else {
      p5.rect(-r / 2, -r / 2, r, r);
    }

    p5.pop();
    
    if (i < anchors.length - 1) {
      if (vars.new_anchor_index_draw === i)
        p5.stroke(100, 255, 100, 130);
      else
        p5.stroke(255, 110);
      p5.strokeWeight(1);
      
      p5.line(
        anchors[i].x,
        anchors[i].y,
        anchors[i + 1].x,
        anchors[i + 1].y
      )
    }
  }
  
//   new anchor point
  if (!mouse_on_anchor && vars.new_anchor_point_draw) {
    p5.stroke(110, 180);
    p5.strokeWeight(1);
    p5.line(p5.mouseX, p5.mouseY, vars.new_anchor_point_draw.x, vars.new_anchor_point_draw.y);
    
    p5.push();
    
      p5.fill(255, 80);

      p5.translate(vars.new_anchor_point_draw.x, vars.new_anchor_point_draw.y);
      p5.rotate(p5.createVector(p5.mouseX, p5.mouseY).sub(vars.new_anchor_point_draw).heading());
      p5.rect(-3, -3, 6, 6);
    
    p5.pop();
  }
}

function interactAnchors(p5, anchors, vars) {
  const r = 10;
  
  let mouse = p5.createVector(p5.mouseX, p5.mouseY);
  
  let new_anchor_point = mouse.copy();
  let new_anchor_index = anchors.length - 2;
  let smallest_distance = Infinity;

  for (let i = anchors.length-1; i >= 0; i--) {
    if (p5.mouseIsPressed) {
      const is_hovering = p5.dist(p5.pmouseX, p5.pmouseY, anchors[i].x, anchors[i].y) < r * 1.4141;

      if (is_hovering && (i === vars.grabbed_index || vars.grabbed_index < 0)) {
        anchors[i].set(p5.mouseX, p5.mouseY);

        if (vars.grabbed_index < 0) {
          if (vars.last_clicked_index == i) {
            vars.click_timer += 30;

            if (vars.click_timer > 30 && anchors.length > 3) {
              anchors.splice(i, 1);
            }
          } else {
            vars.last_clicked_index = i;
          }
          vars.click_timer = 30;
          vars.grabbed_index = i;
        }
      }
    } else {
      vars.grabbed_index = -1;
    }
    
    if (i < anchors.length - 1) {
      let m = mouse.copy().sub(anchors[i]);
      let v = anchors[i + 1].copy().sub(anchors[i]).mult(-1);
      let v_norm = v.copy().normalize();
      
      let dot = v_norm.dot(m);
      
      let p = v_norm.mult(dot).add(anchors[i]);
      
      if (dot < 0 && dot > -v.mag() && p.dist(mouse) < smallest_distance) {
        smallest_distance = p.dist(mouse);
        new_anchor_point = p;
        new_anchor_index = i;
        vars.new_anchor_index_draw = i;
        vars.new_anchor_point_draw = p;
      }
    }
  }

  if (p5.mouseIsPressed && vars.grabbed_index < 0) {
    if (vars.inserting_anchor) {
      anchors[vars.new_anchor_index + 1].set(p5.mouseX,p5.mouseY);
    } else {
      anchors.splice(new_anchor_index + 1, 0, new_anchor_point);
      vars.new_anchor_index = new_anchor_index;
      vars.inserting_anchor = true;
    }
  } else
    vars.inserting_anchor = false;

  vars.click_timer--;
}

let _anchor_vars = {};

function handleAnchors(p5, anchors) {
  interactAnchors(p5, anchors, _anchor_vars);
  
  drawAnchors(p5, anchors, _anchor_vars);
}