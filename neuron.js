// 3b1b's video -- https://www.youtube.com/watch?v=aircAruvnKk

function sigmoid(x) {
    // we can change this later
    // for now, i'm going to use the worst possible function for this
    return Math.tanh(x);
}

class Neuron {
    /**
     * if weights and bias are not specified, they will be randomly generated.
     * @param {Neuron[] | Function} nodes this neuron's input. it can be a function, for an input node
     * @param {Number[]?} weights must have the same length as `nodes`
     * @param {Number?} bias the neurons bias
     */
    constructor(nodes, weights, bias) {
        if (nodes instanceof Array) {
            this.nodes   = nodes;
            this.weights = this.nodes.map((_, index) => {
                return isNaN(weights[index]) ? (Math.random() - 0.5) * 10 : weights[index];
            });

            this.bias     = isNaN(bias) ? (Math.random() - 0.5) * 10 : bias;
            this.is_input = false;
        } else {
            // node is an input node
            this.is_input = true;
            this.weights  = null;
            this.bias     = 0;
            this.input    = nodes;
            this.nodes    = null;
        }

        this.activation = 0;
    }

    activate() {
        if (this.is_input) {
            this.activation = this.input() + this.bias;
        } else {
            var intermediate = this.bias; // add the bias first, because why not
            for (var c = 0; c < this.nodes.length; c++) {
                intermediate += this.nodes[c].activation * this.weights[c];
            }

            this.activation = sigmoid(intermediate);
        }
    }
}