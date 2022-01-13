function drawAnchors(mouse, pmouse, anchors, vars) {
	const r = 6;

	let mouse_on_anchor = false;
	vars.hovering = -1;
	
	let smallest_distance = Infinity;

	for (let i = 0; i < anchors.length; i++) {
		const is_hovering = dist(pmouseX, pmouseY, anchors[i].x, anchors[i].y) < r * 1.4141;
		mouse_on_anchor |= is_hovering;
		if (is_hovering) vars.hovering = i;
		
		if (i < anchors.length - 1) {
			let m = mouse.copy().sub(anchors[i]);
			let v = anchors[i + 1].copy().sub(anchors[i]).mult(-1);
			let v_norm = v.copy().normalize();
			
			let dot = v_norm.dot(m);
			
			let p = v_norm.mult(dot).add(anchors[i]);
			
			if (dot < 0 && dot > -v.mag() && mouse.dist(p) < smallest_distance) {
				smallest_distance = mouse.dist(p);
				new_anchor_point = p;
				new_anchor_index = i;
			}
		}
	}

	if (smallest_distance < r) {
		vars.new_anchor_index = new_anchor_index;
		vars.new_anchor_point_draw = new_anchor_point;
	} else {
		vars.new_anchor_index = -1;
		vars.new_anchor_point_draw = mouse.copy();
	}
	
	for (let i = 0; i < anchors.length; i++) {
		if (i < anchors.length - 1) {
			if (vars.new_anchor_index === i && !mouse_on_anchor)
				stroke(100, 255, 100, 130);
			else
				stroke(255, 110);
			strokeWeight(1);
			
			line(
				anchors[i].x,
				anchors[i].y,
				anchors[i + 1].x,
				anchors[i + 1].y
			)
		}
		
		push();
		
		noStroke();
		fill(255)
		
		translate(anchors[i].x, anchors[i].y);
		if (vars.hovering === i) {
			rotate(frameCount / 30);
			fill(colors.bg);
			stroke(0, 255, 0, 110);
			strokeWeight(1);
			rect(-r * 0.75 - 3, -r * 0.75 - 3, r * 1.5 + 6, r * 1.5 + 6);

			noStroke();
			fill(255);
			if (vars.click_timer > 0 && vars.last_clicked_index === i)
				fill(255, 70, 50); 
			rect(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5);
		} else {
			rect(-r / 2, -r / 2, r, r);
		}

		pop();
	}
// //   new anchor point
//   if (!mouse_on_anchor && vars.new_anchor_point_draw) {
//     push();
		
//       fill(255, 80);

//       translate(vars.new_anchor_point_draw.x, vars.new_anchor_point_draw.y);
//       rotate(createVector(mouseX, mouseY).sub(vars.new_anchor_point_draw).heading());
//       rect(-3, -3, 6, 6);
		
//     pop();
//   }
}

function interactAnchors(mouse, pmouse, anchors, vars) {
	const r = 10;
	
	let new_anchor_point = mouse.copy();
	let new_anchor_index = anchors.length - 2;
	let smallest_distance = Infinity;

	vars.pchanged = vars.changed;
	vars.changed = false;

	for (let i = anchors.length-1; i >= 0; i--) {
		if (mouseIsPressed) {
			const is_hovering = pmouse.dist(anchors[i]) < r * 1.4141;

			if (is_hovering && (i === vars.grabbed_index || vars.grabbed_index < 0)) {
				anchors[i] = mouse.copy();
				vars.changed = true;

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
			
			if (dot < 0 && dot > -v.mag() && mouse.dist(p) < smallest_distance) {
				smallest_distance = mouse.dist(p);
				new_anchor_point = p;
				new_anchor_index = i;
			}
		}
	}

	if (mouseIsPressed && vars.grabbed_index < 0 && vars.new_anchor_index >= 0) {
		if (vars.inserting_anchor) {
			anchors[vars.new_anchor_index + 1] = mouse.copy();
		} else {
			anchors.splice(new_anchor_index + 1, 0, mouse.copy());
			vars.new_anchor_index = new_anchor_index;
			vars.inserting_anchor = true;
		}
		vars.changed = true;
	} else
		vars.inserting_anchor = false;
}

function handleAnchors(spline) {
	if (!spline.vars)
		spline.vars = {};
	interactAnchors(spline.shape, spline.vars);
	
	drawAnchors(spline.shape, spline.vars);
}