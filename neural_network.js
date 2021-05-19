
class Neural_network {
    /**
     * creates a neural network
     * @param {Function[]} inputs the inputs to the neural network 
     * @param {Number[]} layers each element of this array specifies how many neurons are in each layer
     */
    constructor(inputs, layers) {
        this.node_layers = [];
        
        this.node_layers.push(inputs.map(input => {
            return new Neuron(input);
        }));

        layers.forEach((layer, index) => {
            var node_layer = [];
            for (var c = 0; c < layer; c++) {
                node_layer.push(new Neuron(this.node_layers[index], []));
            }
            this.node_layers.push(node_layer);
        });
    }

    activate() {
        this.node_layers.forEach(layer => {
            layer.forEach(neuron => {
                neuron.activate();
            });
        });
    }

    /**
     * 
     * @param {Number[]} values 
     */
    set_values(values) {
        this.node_layers.forEach((layer, index) => {
            if (index < 1) return;
            layer.forEach(neuron => {
                for (var c = 0; c < neuron.weights.length; c++) {
                    neuron.weights[c] = values.shift();
                }
                neuron.bias = values.shift();
            })
        });
    }

    /**
     * @returns {Number[]}
     */
    get_values() {
        var values = [];
        this.node_layers.forEach((layer, index) => {
            if (index < 1) return;
            layer.forEach(neuron => {
                neuron.weights.forEach(weight => {
                    values.push(weight);
                });
                values.push(neuron.bias);
            });
        });

        return values;
    }
}