import csvAttributeIsValid from '../utils/csvAttributeIsValid'

const ValidateAttributeUpdateMiddleware = ({ dispatch, getState}) => next => action => {
  if (!['ADD_TEXT', 'PAIR', 'PARSE_HEADER_FULFILLED'].includes(action.type)) {
    //TODO consolidate action.type dispatch to *UPDATE_CSV_ATTRIBUTES*
    return next(action)
  }

  const { result: newAttributes } = action;
  const { form: csv } = getState().csv;

  let updatedCsv;
  let attrName;

  if (action.type === 'ADD_TEXT') {
    updatedCsv = {
      ...csv,
      mappings: {
        ...csv.mappings,
        [newAttributes.destKey]: {
          ...csv.mappings[newAttributes.destKey],
          value: newAttributes.value
        }
      }
    }
    attrName = newAttributes.destKey
  }

  if (action.type === 'PAIR') {
    updatedCsv = {
      ...csv,
      mappings: {
        ...csv.mappings,
        [newAttributes.destKey]: {
          ...csv.mappings[newAttributes.destKey],
          sourceField: newAttributes.sourceKey
        }
      }
    }
    attrName = newAttributes.destKey
  }

  if (action.type === 'PARSE_HEADER_FULFILLED') {
    updatedCsv = {
      ...csv,
      file: {
        ...csv.file,
        value: newAttributes.file
      }
    }
    attrName = 'file'
  }

  action.errors = {
    [attrName]: !csvAttributeIsValid(updatedCsv, attrName)
  }

  next(action)
};

export default ValidateAttributeUpdateMiddleware;
