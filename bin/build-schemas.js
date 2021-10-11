/**
 * Builds the schemas from ./src/mongodb/schemas.jsonc
 * Generates
 * - ./src/mongodb/types/schemas.compiled.ts
 * - ./src/mongodb/types/documents.compiled.ts
 * - ./src/mongodb/ModelManager.compiled.ts
 */
const path = require('path');
const jsonc = require('jsonc');

const SPEC = path.join(__dirname, '../src/mongodb/schemas.jsonc');

const generate_types_bindings_file = require('./lib/generate-types-bindings-file');
const generate_types_documents_file = require('./lib/generate-types-documents-file');
const generate_types_schemas_file = require('./lib/generate-types-schemas-file');
const generate_types_models_file = require('./lib/generate-types-models-file');
const generate_modelmanager_file = require('./lib/generate-modelmanger-file');
const generate_component_file = require('./lib/generate-component-file');

async function main() {
  const [err, spec] = jsonc.safe.readSync(SPEC);
  if (err) {
    throw new Error(err);
  }

  await Promise.all([
    generate_types_documents_file(spec),
    generate_types_schemas_file(spec),
    generate_types_models_file(spec),
    generate_modelmanager_file(spec),
    generate_types_bindings_file(spec),
    generate_component_file(spec),
  ]);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
