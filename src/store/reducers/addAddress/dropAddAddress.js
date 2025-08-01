import {SET_DROP_ADDRESS_DATA} from '../../actions/addAddress/dropAddAddress';

const initialState = {
  dropAddressData: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DROP_ADDRESS_DATA:
      return {
        dropAddressData: action.dropAddressData,
      };
  }
  return state;
};
