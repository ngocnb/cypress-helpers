module.exports.adminLogin = (configLabel) => {
    let config = Cypress.config(configLabel);
    let options = {};
    // check and config basic auth
    if (config.basicAuthPassword !== undefined) {
        options.auth = {
            username: config.basicAuthUsername,
            password: config.basicAuthPassword,
        };
    }

    // open login page
    cy.visit(config.baseUrl + config.loginUri, options);

    cy.formHelpers.fillTextField("input#login_id", "Username", config.admin.username);
    cy.formHelpers.fillTextField("input#password", "Password", config.admin.password);
    cy.formHelpers.clickButton("button[type='submit']", "login");
    cy.assertHelpers.textVisible("ホーム", "Should be redirected to dashboard");
};

module.exports.adminFillProductForm = (data) => {

}