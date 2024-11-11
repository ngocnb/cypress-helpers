module.exports.generateFieldList = (cy, formSelector, filepath) => {
    const formData = [];

    cy.get(formSelector).within(() => {
        // Process text, select, file, textarea, and checkbox fields
        cy.get('input, select, textarea').each(($el) => {
            const nameAttr = $el.attr('name');
            const idAttr = $el.attr('id');
            const typeAttr = $el.attr('type');

            // skip token field
            if (nameAttr === 'token' || nameAttr === 'csrf_token' || nameAttr === 'entry[_token]' || nameAttr === 'entry[csrf_token]' || nameAttr === '_token') {
                console.log('ignore token field', nameAttr);
                return;
            }

            if (!nameAttr) return;  // Skip if no name attribute is present

            // Generate `field` name based on `name` attribute
            let fieldName = nameAttr.replace(/\[|\]/g, '_').replace(/_{2,}/g, '_').replace(/^_|_$/g, '');

            // Set selector
            let selector = idAttr ? `#${idAttr}` : `input[name='${nameAttr}']`;
            const nameSelector = `input[name='${nameAttr}']`;

            // Determine fill_data_function based on field type
            let fillDataFunction;
            if ($el.is('select')) fillDataFunction = 'selectField';
            else if (typeAttr === 'file') fillDataFunction = 'attachFileField';
            else if ($el.is('textarea')) fillDataFunction = 'fillTextareaField';
            else if (typeAttr === 'checkbox') fillDataFunction = 'checkboxField';
            else if (typeAttr === 'radio') {
                fillDataFunction = 'radioField';
                selector = nameSelector;
            }
            else fillDataFunction = 'fillTextField';

            // for radio type, check if formData has the same field name
            // then skip the duplicated data
            if (typeAttr === 'radio' && formData.some(row => row.field === fieldName)) {
                return;
            }

            // Append field data to formData array
            formData.push({
                field: fieldName,
                selector: selector,
                label: fieldName,
                fill_data_function: fillDataFunction,
            });
        });
    }).then(() => {
        // Convert formData to CSV format
        const csvHeader = 'field,selector,label,fill_data_function\n';
        const csvData = formData.map(row =>
            `${row.field},${row.selector},${row.label},${row.fill_data_function}`
        ).join('\n');

        const csvContent = csvHeader + csvData;

        cy.writeFile(filepath, csvContent);
    });
}