import { addOrderDetails_fs } from "../../../helper/Utils/fireStoreUtils";

export const SET_COMPLAIN_VALUE = 'SET_COMPLAIN_VALUE';
export const SET_ACTIVE_ORDER = 'SET_ACTIVE_ORDER';

export const setComplainValueText = (
  strPickupFirstName,
  strPickupLastName,
  strPickupEmail,
  strPickupPhone,
  strPickupStreet,
  strPickupApartment,
  strPickupCity,
  strPickupState,
  strPickupCountry,
  strPickupZipCode,
  strPickupSending,
  strPickupWeight,
  strPickupDateTime,
  strPickupParcelValue,
  strPickupWidth,
  strPickupHeight,
  strPickupComment,
) => {
  return {
    type: SET_COMPLAIN_VALUE,
    setPickupFirstName: strPickupFirstName,
    setPickupLastName: strPickupLastName,
    setPickupEmail: strPickupEmail,
    setPickupPhone: strPickupPhone,
    setPickupStreet: strPickupStreet,
    setPickupApartment: strPickupApartment,
    setPickupCity: strPickupCity,
    setPickupState: strPickupState,
    setPickupCountry: strPickupCountry,
    setPickupZipCode: strPickupZipCode,
    setPickupSending: strPickupSending,
    setPickupWeight: strPickupWeight,
    setPickupDateTime: strPickupDateTime,
    setPickupParcelValue: strPickupParcelValue,
    setPickupWidth: strPickupWidth,
    setPickupHeight: strPickupHeight,
    setPickupComment: strPickupComment,
  };
};

export const setActiveOrderAction = (data) => {
  return async (dispatch) => {
    /* let res = await addOrderDetails_fs(data);
    if(res){
      dispatch({
        type: SET_ACTIVE_ORDER,
        data: data,
      });
    } */
    dispatch({
      type: SET_ACTIVE_ORDER,
      data: data,
    });
  };
}
