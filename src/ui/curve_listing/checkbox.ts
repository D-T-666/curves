export const createCurveListingCheckbox = (state: boolean, callback: (e:Event) => {}): Element => {
    let checkbox = document.createElement('input');

    checkbox.classList.add('show-hide-curve');
    checkbox.type = 'checkbox';
    checkbox.checked = state;

    checkbox.addEventListener('change', (e) => {

        callback(e);
    });

    checkbox.addEventListener('click', (e) => e.stopPropagation());

    return checkbox;
}