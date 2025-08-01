import {SET_PICKUP_LOCATION_DATA} from '../../../actions/customer/addParcelDetails/setPickupLocationData';

const initialState = {
  pickupLocationData: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PICKUP_LOCATION_DATA:
      return {
        pickupLocationData: action.pickupLocationData,
      };
  }
  return state;
};
