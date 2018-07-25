import attrValidators from './attributeValidators';

export default function csvValidationErrors(csv) {
  const attributeValidators = attrValidators(csv);
  return Object.keys(attributeValidators).reduce((errors, validator) => {
    errors[validator] = !attributeValidators[validator](csv, validator)
    return errors;
  }, {})
}
