const Papa = require("papaparse");

// Function to read csv which returns a promise so you can do async / await.
module.exports.readCSV = async (filePath) => {
    try {
        const csvData = await cy.readFile("cypress/fixtures/example.csv");
        const parsedData = Papa.parse(csvData, { header: true }).data;
        return parsedData;
        // Do something with the parsed data
    } catch (err) {
        // Handle errors
        console.log(err);
        return {};
    }
};
