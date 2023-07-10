
var difficulty = 0;

function setEasy(){
    difficulty = 1;
};
function setNormal(){
    difficulty = 2;
};
function setHard(){
    difficulty = 3;
};

export function getDifficulty(){
    return difficulty;
}