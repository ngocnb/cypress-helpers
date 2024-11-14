module.exports.generateRandomId = (length, prefix = "") => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return prefix + result;
};

module.exports.generateRandomJapaneseString = (length, prefix = "", includeSpace = false, includeNumber = false) => {
    var result = "";
    var characters = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
    if (includeNumber) {
        // include Japanese full-width numbers
        characters += "１２３４５６７８９０";
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

        // randomly add space
        if (Math.random() < 0.5 && includeSpace) {
            result += " ";
            i++;
        }
    }
    return prefix + result;
};

// Example: faker.string.alphanumeric(${MAX_LENGTH} – 2)
module.exports.calculateMathOperationFromString = (str, variable, variablePlaceholder) => {
    // Adjusted regex to capture the operation part only, even if other parameters are present
    const regex = new RegExp(`\\$\\{${variablePlaceholder}\\}\\s*([+\\-*/])\\s*(\\d+)`);

    // Attempt to match the operation expression in the input string
    const match = str.match(regex);

    if (match) {
        const operator = match[1];
        const number = parseInt(match[2], 10);

        // Calculate the result based on the operator
        let calculatedValue;
        switch (operator) {
            case "+":
                calculatedValue = variable + number;
                break;
            case "-":
                calculatedValue = variable - number;
                break;
            case "*":
                calculatedValue = variable * number;
                break;
            case "/":
                calculatedValue = variable / number;
                break;
        }

        // Replace the expression with the calculated value
        let outputString = str.replace(match[0], calculatedValue);

        return outputString; // Return the output string for further use
    } else {
        console.log("No valid expression found in input string.");
        return null; // Return the original string if no match is found
    }
};
