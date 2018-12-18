// Может немного нелепо смотрится, что EagerGraph наследует LazyGraph, но он реализуется через его методы,
// поэтому решил оставить такое наследование и не создавать абстрактный класс.

// Значение вершин кэшируется, ловит ошибки.


const ARGS_REGEX = /([\w_-]+)/gm;

function getParams(func) {
    let funcString = func.toString();
    let result = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).match(ARGS_REGEX);
    if (result === null)
        result = [];
    return result;
}

class LazyGraph {

    receiveGraph(graph) {
        this.graph = graph;
        this.parents = {};
        this.values = {};
        for (let vertex in this.graph)
            this.parents[vertex] = getParams(this.graph[vertex]);
        return this;
    };

    calcVertex(vertex) {
        try {
            if (!this.values[vertex]) {
                let params = [];
                for (let item of this.parents[vertex]) {
                    params.push(this.calcVertex(item));
                }
                this.values[vertex] = this.graph[vertex](...params);

            }
            return this.values[vertex]
        }
        catch (e) {
            if (e instanceof RangeError) {
                throw new RangeError("Обнаружена кольцевая зависимость, идущая от " + vertex)
            } else if (!this.graph) {
                throw new RangeError("Граф пуст или не существует")
            }else if (this.graph[vertex] === undefined) {
                throw new RangeError("Нет такой вершины: " + vertex)
            }

        }
    }
}

class EagerGraph extends LazyGraph {
    receiveGraph(graph) {
        super.receiveGraph(graph);
        for (let vertex in this.graph)
            this.calcVertex(vertex);
        return this;
    };
}
