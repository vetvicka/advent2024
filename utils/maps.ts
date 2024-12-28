export type Point = { x: number, y: number };

export function printMap(map: string[][]) {
    console.log(map.map(arr => arr.join('')).join('\n'))
}

export function isInBounds(data: any[][], {x, y}: Point) {
    return data[x] && data[x][y] !== undefined
}

export const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
]

export function forEachMap<T>(data: T[][], callback: (el: T, point: Point) => void) {
    for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data[x].length; y++) {
            const element = data[x][y];
            callback(element, { x, y });
        }
    }
}

export function isUp(direction: Point) {
    const { x, y } = direction;
    return x === -1 && y === 0;
}
export function isDown(direction: Point) {
    const { x, y } = direction;
    return x === 1 && y === 0;
}
export function isRight(direction: Point) {
    const { x, y } = direction;
    return x === 0 && y === 1;
}
export function isLeft(direction: Point) {
    const { x, y } = direction;
    return x === 0 && y === -1;
}