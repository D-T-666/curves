export const swap = (arr: any[], a: any, b: any): void => {
    let c = arr[a];
    arr[a] = arr[b];
    arr[b] = c;
}