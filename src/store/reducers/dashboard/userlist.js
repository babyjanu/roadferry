import {SET_USER_LIST} from '../../actions/dashboard/userlist';

const initialState = {
  allUserData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_LIST:
      return {
        allUserData: action.allUserData,
      };
  }
  return state;
};
