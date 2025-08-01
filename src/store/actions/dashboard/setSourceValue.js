export const SET_SOURCE_ADDRESS_VALUE = 'SET_SOURCE_ADDRESS_VALUE';

// old logic
/* export const setSourceAddressValue = (textValue, latitude, longitude, allDetails) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      var sourceTextValue = textValue;
      var sourceLatitude = latitude;
      var sourceLongitude = longitude;

      dispatch({
        type: SET_SOURCE_ADDRESS_VALUE,
        setSourceTextValue: sourceTextValue,
        setSourceLatitude: sourceLatitude,
        setSourceLongitude: sourceLongitude,
        sourceAllData: allDetails
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
}; */

export const setSourceAddressValue = (sourceAddressData) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      /* let sourceTextValue = sourceAddressData.formattedAddress;
      let sourceLatitude = sourceAddressData.coordinates.latitude;
      let sourceLongitude = sourceAddressData.coordinates.longitude;
      let allDetails = sourceAddressData.allDetails; */

      dispatch({
        type: SET_SOURCE_ADDRESS_VALUE,
        // setSourceTextValue: sourceTextValue,
        // setSourceLatitude: sourceLatitude,
        // setSourceLongitude: sourceLongitude,
        sourceAllData: sourceAddressData
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
