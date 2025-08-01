import {GET_DRIVER_LIST, IS_LOADING} from '../../../actions/transporter/driver/getDriverData';

const initialState = {
  driverData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DRIVER_LIST:
      return {
        driverData: action.driverData,
        isLoading: action.isLoading
      };
    case IS_LOADING:
      return {
        isLoading: action.isLoading
      }
  }
  return state;
};