import {IS_LOADING_DATA, SET_ADDRESS_LIST} from '../../actions/addAddress/addressData';

const initialState = {
  allAddressData: [],
  isLoadingData: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESS_LIST:
      return {
        allAddressData: action.allAddressData,
        isLoadingData: action.isLoadingData
      };
    case IS_LOADING_DATA:
      return {
        isLoadingData: action.isLoadingData
      };
  }
  return state;
};
