import {GET_VEHICLE_LIST, IS_LOADING} from '../../../actions/transporter/vehicle/getVehicleData';

const initialState = {
  vehicleData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_VEHICLE_LIST:
      return {
        vehicleData: action.vehicleData,
        isLoading: action.isLoading
      };
    case IS_LOADING:
      return {
        isLoading: action.isLoading
      }
  }
  return state;
};