// Реализация рекурсивной функции суммы без обращения к ней по имени и без побочной функции через callee

function sum(a) {
    if (!arguments.callee.store) {
        arguments.callee.store = 0}
    arguments.callee.store += a;
    let func = arguments.callee;
    arguments.callee.toString = function() {let res = func.store; func.store = 0; return res};
    arguments.callee.valueOf = function() {let res = func.store; func.store = 0; return res};
    return arguments.callee;
}
