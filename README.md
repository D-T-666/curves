![logo banner](images/banner.png)

A small Bezier curve editor built with p5.js

live here: [projects.dimitri.ge/curves](https://projects.dimitri.ge/curves)

## Development

to run the dev server: `npm run dev`

---

## To do

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
  - [ ] * select multiple curves
    - [ ] UI
    - [ ] in-canvas
  - [ ] linking curves
    - [ ] linking styles


- [ ] curve style modification
  - [ ] along-the-curve property editor
    - [ ] fill color, weight
    - [ ] stroke color, weight
    - [ ] repeating texture (image)
  - [ ] picking between kinds of curves [nth order Bezier, Cubic B-spline, Quadratic B-spline, ...]
  - [ ] curve render mode selection [thick, ribbon, ...]

- [ ] char creation
  - [ ] ability to specify the baseline
  - [ ] order of the anchors
  - [ ] bounding boxv