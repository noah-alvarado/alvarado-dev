export const pageContentClassName = 'pt-8 px-16 pb-16';

export function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
