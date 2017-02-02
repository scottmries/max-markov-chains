export var elements= [];

export var order;

export var permutations;

export var previousState;

var probabilities = {};

export function setElements(e){
    elements = e;
}

export function setOrder(o){
    order = o;
}

export function initialize(o, e){
    setOrder(o);
    setElements(e);
    permutations = permute();
    choosePreviousState();
    probabilities = setProbabilities();
}

export function permute(){
    if (order === 1){
        return elements;
    } else {
        var loop = 1;
        var permutations = elements.slice(0);
        while (loop < order){
            var nextPermutations = [];
            elements.forEach((e) => {
                permutations.forEach((p) => {
                    nextPermutations.push("" + e + p);
                });
            });
            permutations = nextPermutations.slice(0);
            loop += 1;
        }
        return permutations;
    }
}

export function setProbabilities(){
    var probabilities = {};
    permutations.forEach((e) => {
        probabilities[e] = [];
        var sum = 0;
        for(var i = 0; i < elements.length - 1; i++){
            var r = Math.random();
            probabilities[e][i] = r;
            sum += r;
        }
        for(var i = 0; i < elements.length - 1; i++){
            probabilities[e][i] /= sum;
        }
    });
    return probabilities;
}

export function nextState(){
    var probabilitySet = probabilities[previousState];
    var index = select(probabilitySet, Math.random());
    var arr = previousState.split("");
    var e = elements[index];
    previousState = arr.slice(1, arr.length).concat(e).join("");
    return e;
}

export function select(probabilities, roll){
    var sum = 0;
    for (var i = 0; i < probabilities.length - 1; i++){
        if(roll > sum && roll < probabilities[i]){
            return i;
        } else {
            sum += probabilities[i];
        }
    }
    return probabilities.length - 1;
}

function choosePreviousState(){
    previousState = permutations[Math.floor(Math.random()*permutations.length)];
}

function bang(){
    post(nextState());
}
