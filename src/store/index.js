import {configureStore} from '@reduxjs/toolkit';

import userlistReducer from './reducers/dashboard/userlist';
import addressSetReducer from './reducers/dashboard/setSourceValue';
import destinationAddressSetReducer from './reducers/dashboard/setDestinationValue';
import filterTraspoterListReducer from './reducers/dashboard/filterTranspoterList';
import pickupAddressReducer from './reducers/addAddress/addAddress';
import dropAddAddressReducer from './reducers/addAddress/dropAddAddress';
import addressDataReducer from './reducers/addAddress/addressData';
import setPickupLocationDataReducer from './reducers/customer/addParcelDetails/setPickupLocationData';
import setDropLocationDataReducer from './reducers/customer/addParcelDetails/setDropLocationData';
import getVehicleTypeReducer from './reducers/customer/addParcelDetails/getVehicleType';
import getOrderHistoryDataReducer from './reducers/customer/orderHistory/getOrderHistoryData';
import getTransporterDriverDataReducer from './reducers/transporter/driver/getDriverData';
import getTransporterDataReducer from './reducers/customer/orderHistory/getTrasporterData';
import getTransporterVehicleDataReducer from './reducers/transporter/vehicle/getVehicleData';
import fetchProfileDataReducer from './reducers/customer/profile/fetchProfileData';
import placeOrderReducer from './reducers/placeOrder/placeOrder';

export const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    allUserData: userlistReducer,
    setSourceTextValue: addressSetReducer,
    setSourceLatitude: addressSetReducer,
    setSourceLongitude: addressSetReducer,
    setDestinationTextValue: destinationAddressSetReducer,
    setDestinationLatitude: destinationAddressSetReducer,
    setDestinationLongitude: destinationAddressSetReducer,
    allFilterData: filterTraspoterListReducer,
    pickupAddressData: pickupAddressReducer,
    dropAddressData: dropAddAddressReducer,
    allAddressData: addressDataReducer,
    pickupLocationData: setPickupLocationDataReducer,
    dropLocationData: setDropLocationDataReducer,
    getVehicleTypeReducer: getVehicleTypeReducer,
    customerPendingOrderData: getOrderHistoryDataReducer,
    customerOngoingOrderData: getOrderHistoryDataReducer,
    customerCompletedOrderData: getOrderHistoryDataReducer,
    customerRejectedOrderData: getOrderHistoryDataReducer,
    transporterDriverData: getTransporterDriverDataReducer,
    transporterData: getTransporterDataReducer,
    transporterVehicleData: getTransporterVehicleDataReducer,
    fetchProfileData: fetchProfileDataReducer,
    placeOrderReducer: placeOrderReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});
