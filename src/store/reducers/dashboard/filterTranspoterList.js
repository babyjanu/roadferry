import {IS_TRANSPORTER_LOADING, SET_FILTER_TRANSPOTER_LIST, UPDATE_TRANSPORTER_LIST} from '../../actions/dashboard/filterTranspoterList';

const initialState = {
  allFilterData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_TRANSPOTER_LIST:
      // console.log('trans filter list: ', action.allFilterData);
      return {
        allFilterData: action.allFilterData,
        isLoading: action.isLoading
      };
    case IS_TRANSPORTER_LOADING:
      return {
        isLoading: action.isLoading
      }
    case UPDATE_TRANSPORTER_LIST:
      return{
        allFilterData: action.data
      }
  }
  return state;
};
