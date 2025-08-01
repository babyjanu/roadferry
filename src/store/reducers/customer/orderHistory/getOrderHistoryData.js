import moment from 'moment';
import {GET_ORDER_HISTORY_DATA, LOADING_ORDER_HISTORY_DATA} from '../../../actions/customer/orderHistory/getOrderHistoryData';

const initialState = {
  customerPendingOrderData: [],
  customerOngoingOrderData: [],
  customerCompletedOrderData: [],
  customerRejectedOrderData: [],
  isLoading: false
};

const sortOrderArr = (arr) => {
  let _arr = [];
  if(arr.length > 0){
    // sorting orderData in desc order by created_at date
    _arr = arr.sort((a, b) => moment(b?.data?.created_at.toDate()) - moment(a?.data?.created_at.toDate()))
  }
  return _arr;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_ORDER_HISTORY_DATA:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case GET_ORDER_HISTORY_DATA:
      return {
        customerPendingOrderData: action.customerPendingOrderData,
        customerOngoingOrderData: action.customerOngoingOrderData,
        customerCompletedOrderData: action.customerCompletedOrderData,
        customerRejectedOrderData: action.customerRejectedOrderData,
        isLoading: false
      };
    default:
      return state
  }
};
