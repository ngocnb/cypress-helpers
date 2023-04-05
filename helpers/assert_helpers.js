module.exports.textVisible = (value, stepLabel) => {
    if (value === undefined) return false;

    cy.addStep(stepLabel)
        .contains(value)
        .should("be.visible")
        .then(() => {
            cy.markStepSuccess();
        });
};
