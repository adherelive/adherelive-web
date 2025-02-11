// backend/utils/templateCompiler.js
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Register custom helpers for special characters
handlebars.registerHelper('translate', function(context) {
    return context.translated || context.original;
});

const templates = {
    invoice: fs.readFileSync(path.join(__dirname, '/prescription-template.html'), 'utf8')
};

function compileTemplate(templateName, data) {
    const template = handlebars.compile(templates[templateName]);
    return template(data);
}

module.exports = { compileTemplate };