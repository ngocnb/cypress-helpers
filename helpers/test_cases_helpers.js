const stringHelpers = require("./string_helpers");
const fileHelpers = require("./file_helpers");
const path = require("path");
const { faker } = require("@faker-js/faker");

module.exports.generateFieldList = (cy, formSelector, filepath) => {
    const formData = [];

    cy.get(formSelector)
        .within(() => {
            // Process text, select, file, textarea, and checkbox fields
            cy.get("input, select, textarea").each(($el) => {
                const nameAttr = $el.attr("name");
                const idAttr = $el.attr("id");
                const typeAttr = $el.attr("type");

                // skip token field
                if (
                    nameAttr === "token" ||
                    nameAttr === "csrf_token" ||
                    nameAttr === "entry[_token]" ||
                    nameAttr === "entry[csrf_token]" ||
                    nameAttr === "_token"
                ) {
                    console.log("ignore token field", nameAttr);
                    return;
                }

                if (!nameAttr) return; // Skip if no name attribute is present

                // Generate `field` name based on `name` attribute
                let fieldName = nameAttr.replace(/\[|\]/g, "_").replace(/_{2,}/g, "_").replace(/^_|_$/g, "");

                // Set selector
                let selector = idAttr ? `#${idAttr}` : `input[name='${nameAttr}']`;
                const nameSelector = `input[name='${nameAttr}']`;

                // other attributes
                let maxLength = 0;
                let minLength = 0;
                let isRequired = $el.attr("required") === "required";

                // Determine fill_data_function based on field type
                let fillDataFunction;
                if ($el.is("select")) fillDataFunction = "selectField";
                else if (typeAttr === "file") fillDataFunction = "attachFileField";
                else if (typeAttr === "checkbox") fillDataFunction = "checkboxField";
                else if (typeAttr === "email") fillDataFunction = "fillEmailField";
                else if ($el.is("textarea")) {
                    fillDataFunction = "fillTextareaField";
                    // get max length and min length
                    maxLength = $el.attr("maxlength") ?? 4000;
                    minLength = $el.attr("minlength") ?? 0;
                } else if (typeAttr === "radio") {
                    fillDataFunction = "radioField";
                    selector = nameSelector;
                } else if (typeAttr === "password") {
                    fillDataFunction = "fillTextField";
                    // get max length and min length
                    maxLength = $el.attr("maxlength") ?? 100;
                    minLength = $el.attr("minlength") ?? 0;
                } else {
                    fillDataFunction = "fillTextField";
                    // get max length and min length
                    maxLength = $el.attr("maxlength") ?? 100;
                    minLength = $el.attr("minlength") ?? 0;
                }

                // for radio type, check if formData has the same field name
                // then skip the duplicated data
                if (typeAttr === "radio" && formData.some((row) => row.field === fieldName)) {
                    return;
                }

                // Append field data to formData array
                formData.push({
                    field: fieldName,
                    selector: selector,
                    label: fieldName,
                    fill_data_function: fillDataFunction,
                    fill_data_class: "formHelpers",
                    max_length: maxLength,
                    min_length: minLength,
                    is_required: isRequired,
                });
            });
        })
        .then(() => {
            // Convert formData to CSV format
            const csvHeader =
                "field,selector,label,fill_data_function,fill_data_class,max_length,min_length,is_required\n";
            const csvData = formData
                .map(
                    (row) =>
                        `${row.field},${row.selector},${row.label},${row.fill_data_function},${row.fill_data_class},${row.max_length},${row.min_length},${row.is_required}`
                )
                .join("\n");

            const csvContent = csvHeader + csvData;

            cy.writeFile(filepath, csvContent);
        });
};

module.exports.generateTestCases = async (fieldListFilepath, filepath, suffix = "") => {
    // read csv file from fieldListFilepath
    const fieldList = await fileHelpers.readCSV(fieldListFilepath);
    const rows = [];
    let testCaseCount = 1;
    const headers = ["no", "field", "field_label", "case", "selector", "input_value", "success", "message", "priority"];

    // loop through the fieldList
    for (let i = 0; i < fieldList.length; i++) {
        const field = fieldList[i];
        const fieldname = field.field;
        const selector = field.selector;
        const label = field.label;
        const fillDataFunction = field.fill_data_function;
        const fillDataClass = field.fill_data_class;
        const maxLength = field.max_length;
        const minLength = field.min_length;
        const isRequired = field.is_required;

        const currentDir = path.dirname(__filename);
        const sampleTestCasesFilepath = currentDir + "/../sample_testcases/" + fillDataFunction + suffix + ".csv";
        // read the sample test cases
        const sampleTestCases = await fileHelpers.readCSV(sampleTestCasesFilepath, "utf8");

        // loop through the sample test cases
        for (let j = 0; j < sampleTestCases.length; j++) {
            const sampleTestCase = sampleTestCases[j];

            let inputValue = sampleTestCase.input_value;
            // calculate input value
            // example: faker.string.alphanumeric(${MAX_LENGTH} + 2) --> faker.string.alphanumeric(48)
            // after that, run the function to get the value
            if (sampleTestCase.dynamic_input === "Y") {
                // replace improper characters
                inputValue = stringHelpers.replaceImproperCharacters(inputValue);

                inputValue = stringHelpers.calculateMathOperationFromString(inputValue, maxLength, "MAX_LENGTH");
                inputValue = stringHelpers.calculateMathOperationFromString(inputValue, minLength, "MIN_LENGTH");
                inputValue = inputValue.replace("${MAX_LENGTH}", maxLength);
                inputValue = inputValue.replace("${MIN_LENGTH}", minLength);

                // run the function to get the value
                inputValue = eval(inputValue);
            }
            let message = sampleTestCase.message;
            // replace placeholder with value
            message = message.replace("${MAX_LENGTH}", maxLength);
            message = message.replace("${MIN_LENGTH}", minLength);

            rows.push({
                no: testCaseCount,
                field: fieldname,
                field_label: label,
                case: sampleTestCase.case,
                selector: selector,
                input_value: inputValue,
                success: sampleTestCase.success,
                message: message,
                priority: sampleTestCase.priority,
            });
            testCaseCount++;
        }

        // write the rows to the file
        await fileHelpers.writeCSV(filepath, rows, headers);
    }
};
