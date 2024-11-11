module.exports.fillTextField = (selector, label, value) => {
    if (value !== "" && value !== undefined) {
        cy.addStep(`-- Type '${value}' to ${label} field`)
            .get(selector)
            .clear()
            .type(value)
            .then(() => {
                cy.markStepSuccess();
            });
    } else {
        cy.addStep(`-- Clear ${label} field`)
            .get(selector)
            .clear()
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.fillTextareaField = (selector, label, value) => {
    if (value !== "" && value !== undefined) {
        cy.addStep(`-- Type '${value}' to ${label} field`)
            .get(selector)
            .clear()
            .type(value)
            .then(() => {
                cy.markStepSuccess();
            });
    } else {
        cy.addStep(`-- Clear ${label} field`)
            .get(selector)
            .clear()
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.selectField = (selector, label, value) => {
    if (value !== undefined) {
        cy.addStep(`-- Choose '${value}' in ${label} field`)
            .get(selector)
            .select(value)
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.setValHiddenField = (selector, label, value) => {
    if (value !== undefined) {
        cy.addStep(`-- Set value to ${label} field`)
            .get(selector)
            .then((elem) => {
                elem.val(value);
            })
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.fillCkeditor4Field = (ckeditor_id, label, value) => {
    if (value !== undefined) {
        cy.addStep(`-- Set value to ${label} field`)
            .get(`#${ckeditor_id} .cke_wysiwyg_frame`)
            .first()
            .then((frame) => {
                const iframe = frame.contents();
                const body = iframe.find("body");
                body.attr("contenteditable", "true");
                cy.wrap(body).type(value, { force: true });
                cy.markStepSuccess();
            });
    }
};

module.exports.repeaterImageField = (field_id, label, images) => {
    let count = 1;
    if (images !== [] && images !== undefined) {
        for (let i = 0; i < images.length; i++) {
            if (i > 0) {
                cy.addStep(`-- Add new ${label} field`)
                    .get("a[data-target=repeater-image]")
                    .contains("+ 追加する")
                    .click()
                    .then(() => {
                        cy.markStepSuccess();
                    });
            }
            cy.addStep(`-- Choose image ${i + 1}  to ${label} field`)
                .get(`#${field_id}_${i}_image`)
                .then((elem) => {
                    elem.val(images[i]);
                })
                .then(() => {
                    cy.markStepSuccess();
                });
        }
        cy.addStep(`-- Choose image ${count}  to ${label} field`)
            .get("#image_0_image")
            .then((elem) => {
                elem.val(images[0]);
            })
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.clickButton = (selector, label) => {
    cy.addStep(`Click ${label} button`)
        .get(selector)
        .click()
        .then(() => {
            cy.markStepSuccess();
        });
};

module.exports.attachFileField = (selector, label, files) => {
    if (files === undefined) return true;

    if (Array.isArray(files)) {
        for (let i = 0; i < files.length; i++) {
            cy.addStep(`Attach file to ${label} field`)
                .get(selector)
                .attachFile(files[i])
                .then(() => {
                    cy.markStepSuccess();
                });
        }
    } else {
        cy.addStep(`Attach file to ${label} field`)
            .get(selector)
            .attachFile(files)
            .then(() => {
                cy.markStepSuccess();
            });
    }
};

module.exports.checkboxField = (selector, label, values) => {
    if (values === undefined || values.length == 0) return true;
    console.log(selector, label, values);

    cy.addStep(`Select options of checkbox ${label}`)
        .get(selector)
        .check(values)
        .then(() => {
            cy.markStepSuccess();
        });
};

module.exports.radioField = (selector, label, value) => {
    if (value === undefined) return true;
    cy.addStep(`Select option of radio ${label}`)
        .get(selector)
        .check(value)
        .then(() => {
            cy.markStepSuccess();
        });
};