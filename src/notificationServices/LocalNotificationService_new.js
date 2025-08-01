import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from 'react-native';

class LocalNotificationService {

    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log(" onRegister:", token);
            },
            
            onNotification: function (notification) {
                console.log("onNotification:", notification);
                if (!notification?.data) {
                    return
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }

                console.log('NOTIFICATION:', notification);
                if (notification.foreground) {
                    PushNotification.localNotification({
                        title: notification.title,
                        message: notification.message,
                    });
                }
            },
            // for ios           
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        })
    }

    unRegister = () => {
        PushNotification.unregister()
    }

    showNotification = (data) => {
        console.log('showNotification: ', data);
        PushNotification.localNotification({
            // groupSummary: true,
            // group: 'coco_notification',
            ...this.buildAndroidNotification(data?.title, data?.body),
            title: data?.title || "",
            message: data?.body  || data?.message || "",
            playSound: true,
            userInteraction: false,
            channelId: "roadferry_notification",
            channelName: "roadferry",
            id: 111,
            priority: 'high',
            importance: 'high',
        });
    }

    buildAndroidNotification = (title, message, data) => {
        return {
            id: 1,
            autoCancel: true,
            largeIcon: "ic_launcher",
            smallIcon: "ic_notification",
            bigText: message || '',
            subText: title || '',
            vibrate: true,
            vibration: 300,
            priority: "high",
            importance: "high",
        }
    }

    buildIOSNotification = () => {
        return {
            alertAction: 'view',
            category: "",

        }
    }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) => {
        console.log("[LocalNotificationService] removeDeliveredNotificationByID: ", notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}` })
    }
    
}

export const localNotificationService = new LocalNotificationService()
