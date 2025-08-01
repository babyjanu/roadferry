import DropLocationData from '../../../../helper/models/addParcelDetails/DropLocationData';

export const SET_DROP_LOCATION_DATA = 'SET_DROP_LOCATION_DATA';

export const setDropLocationData = (
  coordinate,
  firstName,
  lastName,
  email,
  phone,
  flatName,
  area,
  city,
  state,
  country,
  pincode,
  notify,
  insurance,
) => {
  return async (dispatch) => {
    // any async code you want!
    //   if (status === 'pickup') {
    console.log('ENTER');
    const loadedDropLocationData = new DropLocationData(
      coordinate,
      firstName,
      lastName,
      email,
      phone,
      flatName,
      area,
      city,
      state,
      country,
      pincode,
      notify,
      insurance,
    );
    console.log('CLOSE');
    //console.log('Drop Location Data is : ', loadedDropLocationData);

    dispatch({
      type: SET_DROP_LOCATION_DATA,
      dropLocationData: loadedDropLocationData,
    });
  };
};
