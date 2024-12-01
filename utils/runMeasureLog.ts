
function measure(fn: Function) {
    const start = Date.now();
    const result = fn();
    const time = Date.now() - start;
    return {result, time}
}

export function runMeasureLog(fn1: Function, fn2: Function) {
    const one = measure(fn1);
    const two = measure(fn2);
    console.log('#1: ', `result: ${one.result} \tin: ${one.time}ms`);
    console.log('#2: ', `result: ${two.result} \tin: ${two.time}ms`);

}