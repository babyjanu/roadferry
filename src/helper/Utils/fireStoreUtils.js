import firestore from '@react-native-firebase/firestore';
import NotificationCall from '../NotificationCall';

export const updateUserDetails_firestore = async (userId, data) => {
  await firestore()
    .collection('users')
    .doc(userId)
    .update(data)
    .then(async () => {
      // console.log(`user.updated`);
    })
    .catch(error => {
      console.log(`user.update.error:`, error);
    });
};

export const addOrderDetails_fs = async orderDetails => {
  let transporterSelectedId = orderDetails?.transporter_details?.id;
  let priority = orderDetails?.transporter_details?.priority;
  // console.log('orderDetails: =============================', orderDetails);
  // console.log(
  //   'transporterSelectedId: =============================',
  //   transporterSelectedId,
  // );
  // console.log('priority: =============================', priority);
  return new Promise((resolve, reject) => {
    /* if (transporterSelectedId && priority) {
      firestore()
        .collection('users')
        .doc(transporterSelectedId)
        .update({priority: priority + 1})
        .then(() => { */
    firestore()
      .collection('order_details')
      .add(orderDetails)
      .then(reddd => {
        console.log('reddd id: ', reddd?.id);
        console.log('orderDetails?.order_id: ', orderDetails?.order_id);
        let parameters = {
          // userId: transporterSelectedId,
          userId: 'uX8stBOJvaYpNZKB7SWsNsEAuTx1',
          type: 'request',
          order_id: orderDetails?.order_id,
          orderId: reddd.id,
        };
        // NotificationCall(parameters); // sending notification to transporter about order
        resolve(parameters);
      })
      .catch(err => {
        console.log(`addOrderDetails_fs(addOrderDetails_fs): `, err);
      });
    /* })
    .catch(err => {
      console.log(`addOrderDetails_fs(users): `, err);
    }); 
}  */
  });
};

export const changeTrans_updateOrderDetails_fs = async orderDetails => {
  let transporterSelectedId = orderDetails?.transporter_details?.id;
  let priority = orderDetails?.transporter_details?.priority;
  console.log(
    'update order and send to another trans: ',
    orderDetails?.id,
    '\n',
    transporterSelectedId,
    '\n',
    priority,
  );
  await firestore()
    .collection('users')
    .doc(transporterSelectedId)
    .update({priority: priority + 1})
    .then(() => {
      firestore()
        .collection('order_details')
        .doc(orderDetails?.id) // this is doc's id not order_id
        .update(orderDetails)
        .then(reddd => {
          // console.log('reddd: ', reddd);
          // console.log('reddd id: ', reddd?.id);
          // console.log('orderDetails?.order_id: ', orderDetails?.order_id);
          let parameters = {
            userId: transporterSelectedId,
            type: 'request',
            order_id: orderDetails?.order_id,
            orderId: orderDetails?.id,
          };
          // NotificationCall(parameters); // sending notification to transporter about order
        })
        .catch(err => {
          console.log(
            `changeTrans_updateOrderDetails_fs(addOrderDetails_fs): `,
            err,
          );
        });
    })
    .catch(err => {
      console.log(`changeTrans_updateOrderDetails_fs(users): `, err);
    });
};

export const updateOrderDetail_fs = async (orderId, data) => {
  console.log('firestore: ', orderId, data);
  await firestore()
    .collection('order_details')
    .doc(orderId)
    .update(data)
    .then(res => {
      console.log('orderDetail updated: ');
    })
    .catch(err => {
      console.log('updateOrderDetail_fs: ', err);
    });
};

export const getNotifications_fs = async(userId, lastVisible=null) => {
  return new Promise(async (resolve, reject) => {
    let query = firestore()
      .collection('notification')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(10); // Fetch 10 notifications at a time

    // If lastVisible is set, fetch the next set of documents after the last one
    if (lastVisible) {
      query = query.startAfter(lastVisible); // Continue from the last document
    }

    query
      .get()
      .then(querySnapshot => {
        let unreadListCount = 0;
        const tNotificationList = [];
        // console.log('Total Notification:', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          const notificationData = documentSnapshot.data();
          tNotificationList.push({
            id: documentSnapshot.id,
            data: notificationData,
          });

          if (notificationData.is_read === false) {
            unreadListCount += 1;
          }
        });

        // Save the last document to use it in the next query
        if (!querySnapshot.empty) {
          lastVisible = querySnapshot.docs[querySnapshot.size - 1];
        }

        let obj = {
          tNotificationList: tNotificationList,
          unreadListCount: unreadListCount,
          lastVisible: querySnapshot.docs[querySnapshot.size - 1]
        };

        resolve(obj);
      })
      .catch(error => {
        resolve(false);
        console.error(error);
      });
  });
};

export const getDriverDataById_firestore = async driverId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(driverId)
      .get()
      .then(driverQs => {
        console.log('driver data firestore: ', driverQs);
        let driverData = {data: {...driverQs.data()}, id: driverQs?.id()};
        resolve(driverData);
      });
  });
};

export const getVehicleDataById_firestore = async vehicleId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('vehicle_details')
      .doc(vehicleId)
      .get()
      .then(vehicleQs => {
        console.log('driver data firestore: ', vehicleQs);
        let vehicleData = {data: {...vehicleQs.data()}, id: vehicleQs?.id()};
        resolve(vehicleData);
      });
  });
};
