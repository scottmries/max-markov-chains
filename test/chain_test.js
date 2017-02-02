import {expect} from 'chai';

import {
        order,
        elements,
        initialize,
        nextState,
        permutations,
        permute,
        previousState,
        select,
        setOrder,
        setElements,
        setProbabilities
        } from '../src/markov_chain.js';

describe("Markov chain", () => {

    describe("setElements", () => {

        it("sets elements to an array", () => {
            setElements([1,2,3,4]);
            expect(elements).to.be.an('array');
            expect(elements).to.deep.equal([1,2,3,4]);
        });
    });

    describe("setOrder", () => {

        it("sets order to a number", () => {
            setOrder(4);
            expect(order).to.equal(4);
        });
    });

    describe("initialize", () => {

        it("sets order and elements to the first and second arguments", () => {
            initialize(4, [1,2,3,4]);
            expect(elements).to.deep.equal([1,2,3,4]);
            expect(order).to.equal(4);
        });
    });

    describe("permute", () => {

        it("returns an array", () => {
            expect(permute()).to.be.an('array');
        });

        it("returns an array of strings each 'order' long", () => {
            initialize(4, ["1","2","3","4"]);
            permute().forEach((e) => {
                expect(e.length).to.equal(order);
            })
        });

        it("returns an array with a length of elements.length to the 'order' power", () => {
            initialize(4, ["1","2","3","4"]);
            expect(permute().length).to.equal(Math.pow(elements.length, order));
        });

        it("returns the given array if order is 1", () => {
            initialize(1, ["1","2","3","4"]);
            expect(permute()).to.deep.equal(["1","2","3","4"]);
        });

        it("returns the correct array with order 2", () => {
            initialize(2, ["1","2","3","4"]);
            expect(permute()).to.deep.equal([
                "11","12","13","14",
                "21","22","23","24",
                "31","32","33","34",
                "41","42","43","44"
            ]);
        });
    });

    describe("initialize", () => {

        it("sets permutations", () => {
            initialize(2, ["1","2","3","4"]);
            expect(permutations).to.not.be.an('undefined');
        });

        it("sets an arbitrary previous state", () => {
            initialize(2, ["1","2","3","4"]);
            expect(previousState).to.not.be.an('undefined');
        });
    });

    describe("setProbabilities", () => {

        it("returns an object", () => {
            initialize(2, ["1","2","3","4"]);
            expect(setProbabilities()).to.be.an('object');
        });

        it("returns an object whose keys are the permutations", () => {
            initialize(2, ["1","2","3","4"]);
            expect(Object.keys(setProbabilities())).to.deep.equal([
                "11","12","13","14",
                "21","22","23","24",
                "31","32","33","34",
                "41","42","43","44"
            ]);
        });

        describe("value", () => {

            initialize(2, ["1","2","3","4"]);
            var probabilities = setProbabilities();

            it("is an array", () => {
                Object.keys(probabilities).map((key) => {
                    expect(probabilities[key]).to.be.an('array');
                });
            });

            describe("array", () => {

                it("has length elements.length - 1", () => {
                    Object.keys(probabilities).map((key) => {
                        expect(probabilities[key].length).to.equal(elements.length - 1);
                    });
                });

                describe("element", () => {

                    it("is a number between zero and one inclusive", () => {
                        Object.keys(probabilities).map((key) => {
                            for(var i = 0; i < probabilities[key].length; i++){
                                var element = probabilities[key][i];
                                expect(element).to.be.a('number');
                                expect(element).to.be.at.least(0);
                                expect(element).to.be.at.most(1);
                            }
                        });
                    });

                    it("changes value on subsequent when probabilities are set", () => {
                        var probability = probabilities["11"][0];
                        expect(probability).to.not.equal(setProbabilities()["11"][0]);
                    });
                });

                it("should sum to 1", () => {
                    Object.keys(probabilities).map((key) => {
                        var sum = 0;
                        for(var i = 0; i < probabilities[key].length; i++){
                            sum += probabilities[key][i];
                        }
                        expect(sum.toPrecision(1)).to.equal("1");
                    });
                });
            });
        });
    });
    describe("select", () => {

        it("takes an array of numbers and a number and returns 0 if the float is less than the first element", () => {
            var arr = [0.25, 0.5, 0.25];
            expect(select(arr, 0.1)).to.equal(0);
        });

        it("returns the index of the element which it is less than and greater than the sum of its previous elements", () => {
            var arr = [0.25, 0.5, 0.25];
            expect(select(arr, 0.3)).to.equal(1);
            expect(select(arr, 0.8)).to.equal(2);
        });
    });

    describe("nextState", () => {

        initialize(2, ["1","2","3","4"]);

        it("returns an element of 'elements'", () => {
            expect(elements).to.contain(nextState());
        });

        it("likely returns the same element at least twice on many calls", () => {
            var returnedElements = {},
                repeatedElement = false;

            for (var i = 0; i < 100; i++){
                var n = nextState();
                if (typeof returnedElements[n] === 'undefined'){
                    returnedElements[n] = 1;
                } else {
                    returnedElements[n] += 1;
                    repeatedElement = true;
                }
            }
            expect(repeatedElement).to.be.ok;
        });

        it("likely returns more than one element at least once on many calls", () => {
            var returnedElements = {},
                differentElement = false;

            for (var i = 0; i < 100; i++){
                var n = nextState();
                if (typeof returnedElements[n] === 'undefined'){
                    returnedElements[n] = 1;
                    if(Object.keys(returnedElements).length > 1){
                        differentElement = true;
                    }
                } else {
                    returnedElements[n] += 1;
                }
            }
            expect(differentElement).to.be.ok;
        });

        it("concatenates the next state onto the previous state, dropping the first char", () => {
            initialize(2, ["1","2","3","4"]);
            var p = previousState + "";
            var n = nextState();
            var arr = p.split("");
            expect(previousState).to.equal(arr.slice(1, arr.length).concat(n).join(""));
        });
    });
});
