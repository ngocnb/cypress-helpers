module.exports.generateRandomInt = (max, min = 0) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

module.exports.padWithZeros = (number, length) => {
    var my_string = "" + number;
    while (my_string.length < length) {
        my_string = "0" + my_string;
    }

    return my_string;
};
