function getMod(v) {
    return v % 20
}

const borderNarrowingStep = 20

function getBorderNarrowing(step) {
    if (step >= 100) {
        return 0
    }

    const current = 5 - Math.ceil(step / 20); // Current border narrowing
    const left = step % 20; // Steps left to border narrowing
    const run = left > 0 && left <= 7 ? 1 : 0; // Should run from border narrowing

    return current + run
}

console.log(getMod(100))
console.log(getMod(99))

console.log('100', getBorderNarrowing(100) == 0)
console.log('99', getBorderNarrowing(99) == 0)
console.log('91', getBorderNarrowing(91) == 0)
console.log('90', getBorderNarrowing(90) == 0)
console.log('81', getBorderNarrowing(85) == 1)
console.log('81', getBorderNarrowing(81) == 1)
console.log('80', getBorderNarrowing(80) == 1)
console.log('1', getBorderNarrowing(1) == 5)
// console.log(getBorderIndex(100) == 1)
// console.log(getBorderIndex(100) == 1)
// console.log(getBorderIndex(100) == 1)
// console.log(getBorderIndex(100) == 1)
// console.log(getBorderIndex(100) == 1)
