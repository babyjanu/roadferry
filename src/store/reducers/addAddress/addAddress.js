import {SET_ADDRESS_DATA} from '../../actions/addAddress/addAddress';

const initialState = {
  pickupAddressData: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESS_DATA:
      return {
        pickupAddressData: action.pickupAddressData,
      };
  }
  return state;
};
