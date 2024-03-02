export const generateFileName = (str: string): string =>{
    let slug = str.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    const timeCode = Date.now();
    return `${timeCode}-${slug}`
}