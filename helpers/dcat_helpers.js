module.exports.adminLogin = (configLabel, verifyDashboardText) => {
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

    formHelpers.fillTextField("input[name='email']", "Username", config.admin.username);
    formHelpers.fillTextField("input[name='password']", "Password", config.admin.password);
    formHelpers.clickButton("button[type='submit']", "login");
    assertHelpers.textVisible(verifyDashboardText, "Should be redirected to dashboard");
};
