## First, I need to outline the steps. Let's break it down:

1. **Translation Setup**: Handle static and dynamic content. Static comes from a JSON file, dynamic from the database
   via Handlebars. Google Translate API can handle dynamic, but need to manage API keys and costs. Maybe cache
   translations to save costs and speed things up.
2. **HTML Template Processing**: Use Handlebars in Node.js to replace placeholders. Need to process both static (from
   JSON) and dynamic (from DB) content. For different languages, the template needs to have the translated static text
   and the dynamic parts translated as well.
3. **PDF Generation with Puppeteer**: After rendering the HTML with translated content, use Puppeteer to convert it to
   PDF. Puppeteer is headless Chrome, so it can render the HTML correctly.
4. **API Endpoints in Node.js**: Create endpoints for generating the PDF. React will call these endpoints when the user
   selects a language. The endpoint needs to accept the language parameter, fetch data, translate as needed, render
   HTML, then convert to PDF.
5. **React UI for Language Selection**: A button in React that opens a modal/popup asking for language choice. On
   selection, call the Node.js API with the chosen language.
6. **Caching Translations**: To avoid translating the same text repeatedly, especially for static fields, cache the
   results. Redis or even a local file cache could work here.
7. **Handling Dynamic Content Translation**: The dynamic content from the database (through Handlebars) might have
   special characters or spaces. Need to make sure that the translation API can handle those. Also, check if
   placeholders in dynamic content (like {{name}}) might interfere with translation. Maybe process the data before
   sending to translate, ensuring placeholders are preserved.
8. **Error Handling**: Ensure that if translation fails, the system defaults to English or handles errors gracefully.
   Also, handle Puppeteer timeouts or rendering issues.
9. **Dependencies**: In Node.js, need Express, Handlebars, Puppeteer, Google Translate API library, and maybe a caching
   library. React side needs Axios or fetch for API calls.
10. **Security**: Google API keys need to be secured, not exposed in client-side code. Keep them in Node.js environment
    variables.
11. **Testing**: Test each part: translation of static and dynamic content, PDF generation, API calls between React and
    Node.js.

## Potential issues to consider:
- **Translation Costs**: Using Google Translate API can get expensive if there's a lot of content. Caching is essential.
- **Async Operations**: Translating content and generating PDFs are async. Need to handle promises correctly in Node.js.
- **Dynamic Content Structure**: If dynamic content includes HTML or special syntax, translation might mangle it. Need
  to parse and translate only text parts, not the HTML tags or placeholders.
- **Performance**: Caching helps, but still need to ensure that the system is responsive. Maybe use queues for PDF
  generation if it's slow.
- **Scalability**: If many users request PDFs simultaneously, the system needs to handle the load. Consider load
  balancing and scaling the translation and PDF generation services.
- **Localization**: If the content needs to be localized (not just translated), the system needs to support different
  formats, currencies, date formats, etc.

## Implementation Steps:
1. **Create Translation Files for Static Content**:
- Have a JSON file for each language, like en.json, hi.json.
- Static content is manually translated? Or perhaps static content is translated once and stored,
  while dynamic uses the API. Static fields come from a local JSON file in English, and dynamic is
  translated via API. So for static, maybe they have a structure like { "header": "Hello", ... }, and then for Hindi,
  another JSON? Or use the same structure but translate the values using the API once and cache them? Hmm, the user says
  static fields fetch from a local JSON using { English1: ..., English2: ... }, and then use Google Translate for
  dynamic content. So maybe static content is in English in the JSON, and when the user selects Hindi, the static parts
  are translated on-the-fly using the API. But that would incur API costs each time. Alternatively, the static content
  could have pre-translated JSON files for each language. But the user wants to use Google Translate for dynamic,
  perhaps static is also translated via API but cached. Need to clarify. The user might want the static text to be
  translated using the JSON file, but I'm not sure. Wait, the user says: "For the static fields in the HTML/PDF file, I
  want it to fetch the details from a local JSON file using the format { English1: , English2: , ...}" So maybe the
  static fields are in English in the JSON, and when the user selects Hindi, those static texts are translated using
  Google Translate. But that's dynamic translation. But the user says "use a good fast tool like Google Translation API
  to convert the dynamic content which is in handlebars". So perhaps static content is stored in multiple JSON files (
  en, hi, es), and dynamic content (from Handlebars) is translated via API. That would make more sense. So the static
  labels (like "Name:", "Date:") are in a JSON file for each language, while the dynamic data (like the actual name or
  date from the database) is translated via API. Wait, but dynamic data from the database may not need translation. For
  example, if the database has a user's name, that's probably in the original language. But maybe the user wants to
  translate even that? Or perhaps the dynamic content is, say, product descriptions stored in English in the DB, and
  needs to be translated to Hindi. So both static and dynamic content need translation, but static is via JSON files (
  pre-translated), and dynamic via API? Hmm, the user's exact words: "static fields ... fetch from a local JSON ... use
  Google Translation API to convert the dynamic content which is in handlebars". So static fields are in a JSON, perhaps
  in English, and dynamic content (from Handlebars) is translated via API. Wait, but then for Hindi PDF, the static
  fields (like labels) need to be in Hindi. So maybe the static fields are stored in a JSON structure where each
  language has its own key. Like:

### translations.json:

```json
    {
        "en": {
            "nameLabel": "Name",
            "dateLabel": "Date"
        },
        "hi": {
            "nameLabel": "नाम",
            "dateLabel": "तारीख"
        }
    }
```

The static fields are in a JSON with English keys. So perhaps the initial setup is that the HTML uses
placeholders like {{nameLabel}}, and the JSON has { "nameLabel": "Name" }, and when translating to Hindi, they replace
the static labels with the Hindi equivalents from another JSON file. But the user wants to use Google Translate for
dynamic content. Maybe the static content is pre-translated and stored in different JSON files per language, and the
dynamic content (from the database) is translated on-the-fly using the API. That would make sense. So the approach would
be:
- Have a translations directory with en.json, hi.json, es.json, etc., each containing the static text for that language.
- When generating the PDF, based on the selected language, load the corresponding JSON file for static text.
- For dynamic content (data from the database), send each value to Google Translate API to translate to the target
  language.

But translating every dynamic field on each request could be slow and costly. So caching translations would be
important. Maybe store translated terms in a database cache so that if the same term is needed again, it's retrieved
from the cache instead of calling the API again.

Alternatively, if the dynamic data doesn't change often, pre-translate and store translations in the database.

But the user wants to use Google Translate for dynamic content, so assuming real-time translation.

### So steps in Node.js:
- When the API is called with a language parameter (e.g., 'hi'), the server does the following:
a. Fetch the static translations from the hi.json file.
b. Fetch the dynamic data from the database.
c. For each dynamic field, send its value to Google Translate API to translate from source (e.g., English) to Hindi.
d. Combine the static translations and translated dynamic data into a context object.
e. Render the Handlebars template with this context.
f. Use Puppeteer to generate PDF from the rendered HTML.
g. Send the PDF back to the client.

But how to handle the source language of the dynamic content? Assuming the dynamic data is stored in English, and needs
to be translated to Hindi. So when the user selects Hindi, both static and dynamic content are translated.

But the static content is from a JSON file, which would have to be maintained in each language. If the user wants to
avoid maintaining multiple JSONs, maybe they want the static content to be translated via Google Translate as well. But
the user's initial statement says static fields are from a local JSON, dynamic via API. So perhaps static content is in
a JSON file in English, and when the user selects another language, the static labels are translated on-the-fly using
Google Translate. But that would be costly and slow. Alternatively, have a base JSON in English, and when the app
starts, pre-translate all static terms into other languages and cache them. But that complicates the setup.

Alternatively, the user may have a different approach: static labels are in a JSON with English keys, and their values
are the English terms. Then, when generating the PDF in Hindi, the server uses Google Translate to translate those
static labels as well as dynamic content. But that would mean translating the static labels every time, which is
inefficient. Hence, better to have pre-translated static labels in JSON files for each language. That way, no need to
call the API for static content, only dynamic.

### So, the plan is:
1. **Static Translations**: Maintain separate JSON files for each language (en.json, hi.json, es.json) containing the
   static text. For example, en.json has { "greeting": "Hello", ... }, hi.json has { "greeting": "नमस्ते", ... }.
2. **Dynamic Translations**: For data coming from the database (via Handlebars), use Google Translate API to translate
   each field's value into the target language.
3. **Handlebars Processing**: Merge the static translations (from the selected language's JSON) and the translated
   dynamic data into a context object, then render the HTML template.
4. **PDF Generation**: Use Puppeteer to convert the rendered HTML to PDF.
5. **Caching**: Implement caching for dynamic translations to reduce API calls and costs.

### Now, for the React part:
- A button in the UI triggers a modal for language selection.
- Upon selection, React calls the Node.js API endpoint with the selected language.
- Node.js processes as above and returns the PDF, which React can download for the user.


# Architecture:

## React Frontend:
- UI for triggering PDF generation (button, language selection).
- API call to your Node.js backend to initiate PDF generation.
- Handling the PDF response (download or display).

## Node.js Backend:
- API endpoint (router.get) to receive the PDF generation request.
- Fetch dynamic data from the database.
- Load static translations from the JSON file.
- Handlebars templating to combine data and HTML.
- Google Cloud Translation API integration for dynamic content.
- Puppeteer for PDF generation (with font embedding).
- Return the PDF as a response.

### Shared Resources (Optional but Recommended):
- A separate repository or shared storage for the HTML template (.html file) and the translation JSON (.json file). This makes it easier to update these resources without redeploying the backend.

## sequenceDiagram
- participant Frontend
- participant Backend
- participant Redis
- participant GoogleTranslate

- Further details sequence
  - Frontend->>Backend: POST /generate-pdf (lang=hi)
  - Backend->>Backend: translateStaticLabels() 
  - Backend->>Redis: Check cache for "Patient Name"
  - Redis-->>Backend: Not found
  - Backend->>GoogleTranslate: Translate "Patient Name"
  - GoogleTranslate-->>Backend: "रोगी का नाम"
  - Backend->>Redis: Cache translation
  - Backend->>Backend: translateObjectToHindi(patient_data)
  - Backend->>Puppeteer: Generate PDF
  - Backend-->>Frontend: PDF download URL

## Key Optimizations for the Hindi HTML
1. Print-Specific Improvements:
   - Added comprehensive @page rules for both A4 and Letter sizes
   - Enhanced print color adjustments with vendor prefixes
   - Improved page break controls
   - Used point (pt) units for more precise print measurements

2. Performance Optimizations:
    - Streamlined font loading with local() fallbacks
    - Removed redundant font declarations
    - Simplified CSS variables structure

3. Layout Stability:
    - Added fixed column widths for tables
    - Improved image size constraints using print-friendly units
    - Enhanced grid layouts with better break control

4. Additional Enhancements:
    - Added word-wrap and hyphenation for better text flow
    - Improved header/footer positioning
    - Enhanced typography scaling for print