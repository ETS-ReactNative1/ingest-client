export function loaded() {
  return (dispatch) => {
    return dispatch({
      type: 'LOADED'
    });
  }
}
