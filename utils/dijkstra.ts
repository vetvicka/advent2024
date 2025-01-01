
import { Point, directions, isInBounds, forEachMap } from "./maps";

export function dijkstra(map: string[][], start: Point, end: Point) {
    type Node = {
        visited: boolean;
        distance: number;
        name: string;
        position: Point;
        predecessor: null | Node
    }
    const nodes: Record<string, Node> = {};
    function node(position: Point): Node {
        return {
            distance: Infinity,
            visited: false,
            position,
            name: `${position.x}-${position.y}`,
            predecessor: null,
        }
    }
    function getAvailableNeighbours(current: Node, closeNodes: Node[] = []) {
        const { x, y } = current.position; 
        return directions
            .filter(([dx, dy]) => {
                const dirPos = { x: x + dx, y: y + dy }
                return isInBounds(map, dirPos) && map[dirPos.x][dirPos.y] === '.';
            })
            .map(([dx, dy]) =>  nodes[`${x + dx}-${y + dy}`])
            .filter(n => !n.visited && !closeNodes.includes(n))
    }
    function pickNextCurrentNode(nodes: Node[]) {
        let minNode = nodes[0];
        nodes.forEach(n => {
            if (n.distance < minNode.distance) {
                minNode = n;
            }
        })
        const index = nodes.indexOf(minNode);
        if (index >= 0) {
            nodes.splice(index, 1);
        } else {
            throw new Error('should not happen')
        }
        return minNode;
    }
    function trace(node: Node, arr: Node[] = []) {
        arr.unshift(node);
        if (node.predecessor) {
            trace(node.predecessor, arr);
        }
        return arr;
    } 
    forEachMap(map, (el, point) => {
        if (el === '.') {
            nodes[`${point.x}-${point.y}`] = node(point);
        }
    })
    let currentPoint = { x: 0, y: 0 };
    let current = nodes[`${currentPoint.x}-${currentPoint.y}`];
    current.distance = 0;
    current.visited = true;
    const closeNodes = [];
    const neighbours = getAvailableNeighbours(current);
    neighbours.forEach(n => {
        n.distance = current.distance + 1;
        n.predecessor = current;
    });
    closeNodes.push(...neighbours);
    while(closeNodes.length > 0) {
        current = pickNextCurrentNode(closeNodes);
        if (current.visited) {
            throw new Error('ooops')
        }
        current.visited = true;
        
        if (current.position.x === end.x && current.position.y === end.y) {
            return { distance: current.distance, trace: trace(current)};
        }
        const neighbours = getAvailableNeighbours(current, closeNodes);
        neighbours.forEach(n => {
            if (n.visited) {
                throw new Error('should never return visited node')
            }
            n.distance = current.distance + 1;
            n.predecessor = current;
        });
        closeNodes.push(...neighbours);
    }
    return null;
}