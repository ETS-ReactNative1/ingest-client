import { csvValidationError } from '../actions/csv';
import csvValidationErrors    from '../utils/csvValidationErrors';
import csvIsValid             from '../utils/csvIsValid';

const formValidationMiddleware = ({ dispatch, getState}) => next => action => {
  if (action.type !== "validate") {
    return next(action)
  }
  const { data: csv } = action;
  let errors = csvValidationErrors(csv)
  if (!csvIsValid(errors)) {
    dispatch(csvValidationError(errors))
    //return promise to chain in calling func.
    return new Promise(function(resolve, reject) {
      reject();
    });
  } else {
    return next(action)
  }
};

export default formValidationMiddleware;
