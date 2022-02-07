![logo banner](images/banner.png)

A small Bezier curve editor built with p5.js

live here: [projects.dimitri.ge/curves](https://projects.dimitri.ge/curves)

## Development

to run the dev server: `npm run dev`

---

## TODO

- [x] moving, scaling, and rotating curves
- [x] editing curve anchors
  - [x] moving existing anchors around
  - [x] inserting anchors
- [x] switching between edit modes
- [ ] multiple curves
  - [x] UI
  - [x] functionality
    - [x] insertion/deletion/duplication
    - [x] rearrangement
  - [x] click select (should select the curve you click on the canvas)
  - [ ] select multiple curves
    - [ ] UI
    - [ ] in-canvas
- [ ] char creation
  - [ ] ability to specify the baseline
  - [ ] order of the anchors
  - [ ] bounding box
- [ ] curve customization
  - [ ] styling
  - [ ] picking between kinds of curves (nth order Bezier, Cubic B-spline, Quadratic B-spline, ...)
  - [ ] animation