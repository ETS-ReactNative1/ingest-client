export default function attributeValidators(csv) {
  return {
    file: fileValid,
    ...mappingsWithValidators(csv.mappings)
  }
}

function mappingsWithValidators(mappings) {
  return Object.keys(mappings).reduce((obj, field) => {
    obj[field] = mappingValid;
    return obj;
  }, {});
}

function mappingValid(csv, field) {
  const fieldValue = csv.mappings[field];
  const fieldType = fieldValue.type;
  if (fieldType == 'select' && !fieldValue.sourceField) {
    return false;
  }
  if (fieldType == 'text' && !fieldValue.value) {
    return false
  }
  return true;
}

function fileValid(csv) {
  if (!csv.file.value) {
    return false;
  }
  return true;
}
