const { generateTestCases } = require("../../../helpers/test_cases_helpers");

describe("generateTestCases", () => {
    it("fillTextField test", () => {
        generateTestCases(
            "./test/sample_fieldlist/010_fillTextField_field_list.csv",
            "./test/sample_testcases/010_fillTextField_test_cases.csv"
        );
    });
});
