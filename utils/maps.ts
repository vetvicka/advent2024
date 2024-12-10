export function printMap(map: string[][]) {
    console.log(map.map(arr => arr.join('')).join('\n'))
}