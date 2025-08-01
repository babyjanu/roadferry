import {CLEAR_PROFILE_DATA, FETCH_PROFILE_DATA} from '../../../actions/customer/profile/fetchProfileData';

const initialState = {
  fetchProfileData: [],
  userUID: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_DATA:
      return {
        fetchProfileData: action.fetchProfileData,
        userUID: action.userUID
      };
    case CLEAR_PROFILE_DATA:
      return {
        fetchProfileData: [],
        userUID: null
      };
  }
  return state;
};
