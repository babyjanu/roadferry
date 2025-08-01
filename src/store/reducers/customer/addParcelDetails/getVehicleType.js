import {GET_VEHICLE_TYPE_LIST, IS_VEHICLE_TYPE_LOADING} from '../../../actions/customer/addParcelDetails/getVehicleType';

const initialState = {
    vehicleTypeList: [],
    isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_VEHICLE_TYPE_LIST:
      return {
        vehicleTypeList: action.vehicleTypeList,
        isLoading: action.isLoading
      };
    case IS_VEHICLE_TYPE_LOADING:
      return {
        isLoading: action.isLoading
      }
  }
  return state;
};