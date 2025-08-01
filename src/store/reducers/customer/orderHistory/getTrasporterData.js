import {GET_TRANSPOTER_DATA} from '../../../actions/customer/orderHistory/getTrasporterData';

const initialState = {
  transporterData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TRANSPOTER_DATA:
      return {
        transporterData: action.transporterData,
      };
  }
  return state;
};
