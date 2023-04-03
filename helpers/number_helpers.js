module.exports.generateRandomInt = (max, min = 0) => {
    let result = Math.floor(Math.random() * Math.floor(max));
    if (result < min) {
        result = result + min;
    }
    return result;
}

module.exports.padWithZeros = (number, length) => {
    var my_string = "" + number;
    while (my_string.length < length) {
        my_string = "0" + my_string;
    }

    return my_string;
}
