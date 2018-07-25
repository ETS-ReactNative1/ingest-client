import attrValidators from './attributeValidators';

export default function csvAttributeIsValid(csv, attribute) {
  const attributeValidators = attrValidators(csv);
  if (attributeValidators[attribute]) {
    return attributeValidators[attribute](csv, attribute);
  } else {
    return true;
  }
}
