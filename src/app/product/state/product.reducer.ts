export function reducer(state, action) {
  console.log('State:', state);
  console.log('Action:', action);
  switch (action.type) {
    case 'TOGGLE_PRODUCT_CODE':
      return { ...state, showProductCode: action.payload };

    default:
      return state;
  }
}
