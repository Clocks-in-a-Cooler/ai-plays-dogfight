## AI plays Dogfight

Each generation is 60 players, all trying to get the most kills. A plane earns one point for each kill. If a plane hits the ground, its score is reset to zero.

Sometimes, a few planes will remain, flying in formation and not competing. In this case, after 90 seconds, all of the remaining planes will have their scores reset to zero and the next generation begins, for no other reason other than I want to.

The neural network has eight inputs: five lines of sight, the angle of the plane, its distance from the ground, and a bias. There are two hidden layers, with eight and five nodes. The output is the controls for the plane: up, down, or fire.

The colour of each plane is also hereditary, although each plane in the next generation has a 10% chance of having a random colour instead of its parent colour.

[Try it out](https://clocks-in-a-cooler.github.io/ai-plays-dogfight)