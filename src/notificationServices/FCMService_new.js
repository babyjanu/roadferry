import messaging from '@react-native-firebase/messaging'
import {Platform} from 'react-native';

class Service {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async() => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true)
        }
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus) {
          console.log('Permission status:', authorizationStatus);
        } 
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
        .then(enabled => {
            if (enabled) { 
                this.getToken(onRegister)
            } else {
                this.requestPermission(onRegister)
            }
        }).catch(error => {
            console.log("error FCMSERVICE LINE NO 29", error)
        })
    }

    getToken = (onRegister) => {
      
        messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
                onRegister(fcmToken)
            }else {
                console.log(" FCMSERVICE LINE NO 38")
            }
        }).catch(error => {
            console.log(" FCMSERVICE LINE NO 42 getToken rejected ", error)
        })
    }

    requestPermission = (onRegister) => {
         messaging().requestPermission()
        .then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log("error FCMSERVICE LINE NO 51 Request Permission rejected ", error)
        })
    }

    deleteToken = () => {
        console.log(" FCMSERVICE LINE NO 56 deleteToken ")
        messaging().deleteToken()
        .catch(error => {
            console.log(" FCMSERVICE LINE NO 59 Delete token error ", error)
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        messaging()
        .onNotificationOpenedApp(remoteMessage => {
            console.log(' FCMSERVICE LINE NO 68 onNotificationOpenedApp Notification caused app to open from background state:',remoteMessage)
            if (remoteMessage) {
                const notification = remoteMessage
                onOpenNotification(notification)
            }
        });

        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                const notification = remoteMessage
                onOpenNotification(notification)
            }
        });
        

        this.messageListener = messaging().onMessage(async remoteMessage => {
            if (remoteMessage) {
                let notification = null
                // console.log('DATA',remoteMessage);
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.data
                } else {
                    notification = remoteMessage.data
                }
                onNotification(notification)
            }
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
            // Handle background logic, e.g., save to local storage or show a notification
            if (remoteMessage) {
                let notification = null
                // console.log('DATA',remoteMessage);
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.data
                } else {
                    notification = remoteMessage.data
                }
                onNotification(notification)
            }
        });

        messaging().onTokenRefresh(fcmToken => {
            onRegister(fcmToken)
        })

    }
    

    unRegister = () => {
        this.messageListener()
    }
}

export const FCMService = new Service()