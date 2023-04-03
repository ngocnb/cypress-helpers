cy.stepsToReproduce = [];

Cypress.Commands.add("addStep", (step) => {
  cy.stepsToReproduce.push(step);
});

Cypress.Commands.add("markStepSuccess", () => {
  const step = cy.stepsToReproduce.pop();
  cy.stepsToReproduce.push(`${step} --> OK`);
});

Cypress.Commands.add("addReportContext", (title, value) => {
  cy.once("test:after:run", (test) => addContext({ test }, { title, value }));
});
