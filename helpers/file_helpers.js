const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");

module.exports.readCSV = async (filePath) => {
    try {
        // Read the CSV file asynchronously as a string
        const csvData = await fs.readFileSync(filePath, "utf8"); // Provide encoding directly here

        // Parse the CSV data using PapaParse
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

        // Return the parsed data
        return parsedData;
    } catch (err) {
        // Handle errors, e.g., file not found or parsing issues
        console.error("Error reading or parsing CSV:", err);
        return []; // Return an empty array in case of error
    }
};

module.exports.writeCSV = (filePath, rows, headers) => {
    try {
        // Step 1: Ensure the directory exists
        const dir = path.dirname(filePath); // Get the directory from the file path
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory recursively if it doesn't exist
        }

        // Step 2: Prepare the header line (first row)
        const headerLine = headers.join(",") + "\n"; // Join headers with commas and add a newline

        // Step 3: Prepare the rows
        const rowLines = rows
            .map((row) => {
                return headers.map((header) => row[header]).join(","); // For each row, map the headers to the corresponding values
            })
            .join("\n"); // Join all rows with newlines

        // Step 4: Combine header and rows
        const csvData = headerLine + rowLines + "\n"; // Final CSV data

        // Step 5: Write to file using fs.writeFileSync
        fs.writeFileSync(filePath, csvData);

        console.log("CSV file written successfully!");
    } catch (err) {
        console.error("Error writing CSV file:", err);
    }
};
