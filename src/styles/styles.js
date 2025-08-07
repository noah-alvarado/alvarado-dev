export const pageContentClassName = `
    p-4 sm:p-8
    w-full flex-1
    flex flex-col
    items-center
    bg-[#e0f7fa] dark:bg-gray-800
`;

export function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
