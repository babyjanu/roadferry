import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class Service {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission rejected', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] Delete token');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete Token error', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open',
      );
      if (remoteMessage) {
        //console.log(`remoteMessage ${JSON.stringify(remoteMessage)}`)
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data;
          onOpenNotification(notification);
        } else {
          notification = remoteMessage.data;
          alert(notification.body)
        }
        console.log(`notification:-> ${JSON.stringify(notification)}`)
        
      }
    });

    // When the application on is opened from a quite state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open',
        );
        if (remoteMessage) {
          let notification = null;
          if (Platform.OS === 'ios') {
            notification = remoteMessage.data;
          } else {
            notification = remoteMessage.data;
          }
          console.log(remoteMessage);
          onOpenNotification(notification);
        }
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A New FCM Message arrived', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data;
        } else {
          notification = remoteMessage.data;
        }
        onNotification(notification);
        // alert(notification.body)
      }
    });
    
    // Background state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Handle background logic, e.g., save to local storage or show a notification
      if (remoteMessage) {
        let notification = null;
        // console.log('DATA',remoteMessage);
        if (Platform.OS === 'ios') {
            notification = remoteMessage.data;
        } else {
            notification = remoteMessage.data;
        }
        // commented to fix duplication of notifications
        // onNotification(notification);
      }
    });

    // Triggerred when have new token
    messaging().onTokenRefresh((fcmToken) => {
      console.log('[FCMService] No token refresh', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const FCMService = new Service();