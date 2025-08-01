import {SET_SOURCE_ADDRESS_VALUE} from '../../actions/dashboard/setSourceValue';

const initialState = {
  setSourceTextValue: '',
  setSourceLatitude: '',
  setSourceLongitude: '',
  sourceAllData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SOURCE_ADDRESS_VALUE:
      return {
        // setSourceTextValue: action.setSourceTextValue,
        // setSourceLatitude: action.setSourceLatitude,
        // setSourceLongitude: action.setSourceLongitude,
        sourceAllData: { ...state.sourceAllData, ...action.sourceAllData },
      };
  }
  return state;
};
