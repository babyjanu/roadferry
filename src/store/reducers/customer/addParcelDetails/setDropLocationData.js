import {SET_DROP_LOCATION_DATA} from '../../../actions/customer/addParcelDetails/setDropLocationData';

const initialState = {
  dropLocationData: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DROP_LOCATION_DATA:
      return {
        dropLocationData: action.dropLocationData,
      };
  }
  return state;
};
