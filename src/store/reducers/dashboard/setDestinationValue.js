import {SET_DESTINATION_ADDRESS_VALUE} from '../../actions/dashboard/setDestinationValue';

const initialState = {
  setDestinationTextValue: '',
  setDestinationLatitude: '',
  setDestinationLongitude: '',
  destinationAllData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DESTINATION_ADDRESS_VALUE:
      return {
        // setDestinationTextValue: action.setDestinationTextValue,
        // setDestinationLatitude: action.setDestinationLatitude,
        // setDestinationLongitude: action.setDestinationLongitude,
        destinationAllData: { ...state.destinationAllData, ...action.destinationAllData},
      };
  }
  return state;
};
