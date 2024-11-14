const { calculateMathOperationFromString } = require("../../../helpers/string_helpers");

describe("calculateMathOperationFromString", () => {
    test('replaces "${MAX_LENGTH} - 2" with correct result', () => {
        const inputString = "faker.string.alphanumeric(${MAX_LENGTH} - 2)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.string.alphanumeric(48)");
    });

    test('replaces "${MAX_LENGTH} + 10" with correct result', () => {
        const inputString = "faker.string.alphanumeric(${MAX_LENGTH} + 10)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.string.alphanumeric(60)");
    });

    test('handles multiplication "${MAX_LENGTH} * 2"', () => {
        const inputString = "faker.string.alphanumeric(${MAX_LENGTH} * 2)";
        const variable = 25;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.string.alphanumeric(50)");
    });

    test('handles division "${MAX_LENGTH} / 5"', () => {
        const inputString = "faker.string.alphanumeric(${MAX_LENGTH} / 5)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.string.alphanumeric(10)");
    });

    test("returns original string if no valid expression is found", () => {
        const inputString = "faker.string.alphanumeric(${OTHER_VAR} - 2)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe(inputString);
    });

    test("handles function string with multiple parameters", () => {
        const inputString = "stringHelpers.generateRandomJapaneseString(${MAX_LENGTH} - 2, '', true)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("stringHelpers.generateRandomJapaneseString(48, '', true)");
    });

    test("handles function string as second parameter with multiple parameters", () => {
        const inputString = "faker.lorem.sentence(10).substring(0, ${MAX_LENGTH} - 2)";
        const variable = 50;
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.lorem.sentence(10).substring(0, 48)");
    });

    test("handles variable as string", () => {
        const inputString = "faker.lorem.sentence(10).substring(0, ${MAX_LENGTH} - 2)";
        const variable = "50";
        const variablePlaceholder = "MAX_LENGTH";
        const result = calculateMathOperationFromString(inputString, variable, variablePlaceholder);
        expect(result).toBe("faker.lorem.sentence(10).substring(0, 48)");
    });
});
