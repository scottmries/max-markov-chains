# Markov Chain for Max

This script for Max's js object will generate a Markov Chain with an arbitrary number of elements and an arbitrary order.

Initializing the object sets probability matrices for all possible states.

Sending a bang outputs the next state according to these probability matrices.

To do:
* Allow setProbabilities to take arguments to set them manually.
* Take creation arguments from the Max object, the first being order, the rest being elements.
* Test in a Max js object.
