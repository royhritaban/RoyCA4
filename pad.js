let fruits = ["apple", "banana", "orange", "grape", "kiwi"]

let longFruits = fruits.filter(function(currentValue) {
    if (currentValue.length  > 5){
        return currentValue;
    }
});
// FUCKING BRILLIANT
console.log(longFruits)