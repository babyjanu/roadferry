import firestore from '@react-native-firebase/firestore';

export const GET_ORDER_HISTORY_DATA = 'GET_ORDER_HISTORY_DATA';
export const LOADING_ORDER_HISTORY_DATA = 'LOADING_ORDER_HISTORY_DATA';

export const getCustomerOrderData = (UID) => {
  return async (dispatch) => {
    try {
      const loadedPendingData = [];
      const loadedOngoingData = [];
      const loadedCompletedData = [];
      const loadedRejectedData = [];

      dispatch({
        type: LOADING_ORDER_HISTORY_DATA,
        isLoading: true
      });

      firestore()
        .collection('order_details')
        .orderBy('created_at', 'desc')
        .where('requested_uid', '==', UID)
        .get()
        .then((querySnapshot) => {
          // console.log('Total order data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('Status is : ', documentSnapshot.get('status'));
            const status = documentSnapshot.get('status'); // Get status once
            const ongoingStatuses = new Set([
              'on-loading', 'assigned', 'on-way', 'started', 'unloading', 
              'dispute', 'unloaded', 'at pickup location', 'at destination location'
            ]);

            if (ongoingStatuses.has(status)) {
              loadedOngoingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
            } else if (status === 'rejected') {
              loadedRejectedData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
            } else if (status === 'completed') {
              loadedCompletedData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
            } else {
              loadedPendingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
            }
          });

          dispatch({
            type: GET_ORDER_HISTORY_DATA,
            customerPendingOrderData: loadedPendingData,
            customerOngoingOrderData: loadedOngoingData,
            customerCompletedOrderData: loadedCompletedData,
            customerRejectedOrderData: loadedRejectedData
          });
        })
        .catch(err => {
          console.log('catch err order_details.get: ', err);
          dispatch({
            type: LOADING_ORDER_HISTORY_DATA,
            isLoading: false
          });
        });
    } catch (err) {
      dispatch({
        type: LOADING_ORDER_HISTORY_DATA,
        isLoading: false
      });
      throw err;
    }
  };
};
