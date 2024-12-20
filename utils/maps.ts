export function printMap(map: string[][]) {
    console.log(map.map(arr => arr.join('')).join('\n'))
}

export function isInBounds(data: any[][], x: number, y: number) {
    return data[x] && data[x][y] !== undefined
}