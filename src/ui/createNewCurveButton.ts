export const createNewCurveButton = (p: p5, on_click: (e: Event) => any): Element => {
    let new_curve = document.createElement('button');

    new_curve.id = 'new-curve';
    new_curve.innerText = '+ new curve';
    
    new_curve.addEventListener('click', on_click, false);

    return new_curve;
}