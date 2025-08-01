import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../components/design/Loader';
import moment from 'moment';
import CHeader from '../../../components/CHeader';
import { getNotifications_fs } from '../../../helper/Utils/fireStoreUtils';
import { useSelector } from 'react-redux';

// Load the main class.

const NotificationScreen = props => {
  const [notificationList, setNotificationList] = useState([]);
  const [lastVisibleNotif, setLastVisibleNotif] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const params = props?.route?.params;
  let isUpdate = params?.isUpdate;
  let notificationCount = params?.notificationCount;
  let userID = params?.userID;

  let user_Id = useSelector((state) => state.fetchProfileData.userUID);

  if (notificationCount == undefined || notificationCount == null) {
    notificationCount = 0;
  }

  if (userID == undefined || userID == null) {
    userID = 0;
  }

  if (isUpdate == undefined || isUpdate == null) {
    isUpdate = false;
  }

  useEffect(() => {
    getNotificationList();
  }, [isUpdate]);

  const getNotificationList = (isloadMore=false) => {
    // console.log(`getNotificationList: `, isloadMore);
    isloadMore ? setIsLoadingMore(true) : setIsLoading(true);
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then(async(userID) => {
      if (userID != null) {
        let notifObj = lastVisibleNotif ? await getNotifications_fs(userID, lastVisibleNotif) : await getNotifications_fs(userID);
        // console.log('got notifiations: ', notifObj);
        isloadMore ? setIsLoadingMore(false) : setIsLoading(false);
        if(notifObj){
          props.navigation.setParams({
            notificationCount: notifObj?.unreadListCount,
            userID: userID,
          });
          setNotificationList(prevNotifications => [
            ...prevNotifications,
            ...notifObj?.tNotificationList,
          ]);
          setLastVisibleNotif(notifObj?.lastVisible);
        }
      } else {
        isloadMore ? setIsLoadingMore(false) : setIsLoading(false);
      }
    });
  };

  const refreshData = async() => {
    setIsLoading(true);
    let notifObj = await getNotifications_fs(user_Id);
    setIsLoading(false);
    if(notifObj){
      setNotificationList(notifObj?.tNotificationList);
    }
  };

  const unreadNotification = notificationData => {
    // console.log(`unreadNotification: `, notificationData);
    setIsLoading(true);
    firestore()
      .collection('notification')
      .doc(notificationData.id)
      .update({is_read: true})
      .then(() => {
        // setIsLoading(false)
        // getNotificationList();
        refreshData();
        // openViewOnClickOfNotification(notificationData);
      })
      .catch(err => {
        console.log(`priority.Error:`, err);
        setIsLoading(false);
      });
  };

  const unreadAllNotification = () => {
    firestore()
      .collection('notification')
      .where('user_id', '==', userID)
      .get()
      .then(querySnapshot => {
        // setIsLoading(false)
        querySnapshot.forEach(documentSnapshot => {
          documentSnapshot.ref.update({is_read: true});
        });
        refreshData();
        props.navigation.setParams({isUpdate: true});
      })
      .catch(err => {
        console.log(`priority.Error:`, err);
        setIsLoading(false);
      });
  };

  const openViewOnClickOfNotification = notificationData => {
    console.log(`notificationData.data.type:`, notificationData.data);
    if (
      notificationData.data.orderId != undefined &&
      notificationData.data.orderId != '' &&
      notificationData.data.orderId != null
    ) {
      if (notificationData.data.type == 'accept') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'unloaded') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'assign') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'transporter_reject') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'no_transporter_reject') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'started') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'on-way') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'unloading') {
        openOrderDetailsScreen(notificationData.data.orderId);
      } else if (notificationData.data.type == 'dispute') {
        openOrderDetailsScreen(notificationData.data.orderId);
      }
    }
  };

  const openOrderDetailsScreen = orderId => {
    props.navigation.navigate('OrderDetailsScreen', {
      orderID: orderId,
    });
  };

  const renderNotificationData = (itemData, index) => {
    let a = moment(itemData.item.data.created_at.toDate());
    let b = moment(new Date());

    let seconds = b.diff(a, 'seconds');
    let minutes = b.diff(a, 'minutes');
    let hours = b.diff(a, 'hours');
    let days = b.diff(a, 'days');
    let years = b.diff(a, 'years');
    
    let getTime = '';
    if (years > 0) {
      getTime = `${years} ${years <= 1 ? 'year' : 'years'}`;
    } else if (days > 0) {
      getTime = `${days} ${days <= 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      getTime = `${hours} ${hours <= 1 ? 'hour' : 'hours'}`;
    } else if (minutes > 0) {
      getTime = `${minutes} ${minutes <= 1 ? 'minute' : 'minutes'}`;
    } else if (seconds > 0) {
      getTime = `${seconds} ${seconds <= 1 ? 'second' : 'seconds'}`;
    }
    // console.log(`getTime:`, getTime)
    return (
      <TouchableOpacity
        key={index}
        style={styles.notificationView}
        onPress={() => {
          if (!itemData.item.data.is_read) {
            unreadNotification(itemData.item);
          } else {
            // openViewOnClickOfNotification(itemData.item);
          }
        }}
      >
        <View style={styles.itemRow}>
          <Text style={styles.titleText}>{itemData.item.data.title}</Text>
          {itemData.item.data.is_read == false ? (
            <Image
              style={{width: 16, height: 16}}
              source={require('../../../assets/assets/dashboard/notification_unread.png')}
            />
          ) : null}
        </View>
        <Text style={styles.subTitleText}>{itemData.item.data.text}</Text>
        <Text
          style={{
            ...styles.subTitleText,
            color: Colors.subTitleTextColor,
            marginBottom: 16,
          }}
        >
          {`${getTime} ago`}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyItem = () => {
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{width: 84, height: 84, alignSelf: 'center'}}
          source={require('../../../assets/assets/dashboard/no_notification.png')}
        />
        <Text
          style={{
            color: '#9DA4BB',
            marginTop: 12,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          No notification
        </Text>
      </View>
    )
  };

  const loadMore = () => {
    if(lastVisibleNotif){ // to fix loadMore() called automatically on flatlist mount.
      getNotificationList(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CHeader
        headerTitle={'Notifications'}
        isBackBtn={true}
        navigation={props.navigation}
        rightComponent={
          notificationCount == 0 ? null : (
            <TouchableOpacity
              onPress={() => {
                unreadAllNotification();
              }}
            >
              <Text
                style={{
                  color: Colors.primaryColor,
                  fontSize: RFPercentage(2),
                  fontFamily: 'SofiaPro-Regular',
                }}
              >
                Read all
              </Text>
            </TouchableOpacity>
          )
        }
      />

      <View style={styles.containerCheck}>
        {isLoading ? <Loader loading={isLoading} noModal={true} />
          : <FlatList
            // style={{marginTop: 16, marginBottom: 16}}
            keyExtractor={(item, index) => index}
            data={notificationList}
            renderItem={renderNotificationData}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyItem}
            contentContainerStyle={{ flexGrow: 1}}
            onEndReached={loadMore}
            ListFooterComponent={isLoadingMore ? 
              <ActivityIndicator
                color={Colors.primaryColor}
                style={{ marginVertical: 12 }}
                animating={isLoadingMore}
                size="large"
              /> : null
            }
          />
        }
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.mainBackgroundColor,
  },
  containerCheck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  notificationView: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  titleText: {
    // margin: 16,
    // marginBottom: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Bold',
  },
  subTitleText: {
    margin: 16,
    marginTop: 8,
    marginBottom: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.titleTextColor,
  },
  itemRow: {
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default NotificationScreen;
{
  /* <TextInput
          style={{height: 40}}
          label="Source"
          returnKeyType="next"
          value={source.value}
          onChangeText={(text) => setSource({value: text, error: ''})}
          error={!!source.error}
          errorText={source.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._sourceinput = ref;
          }}
          onSubmitEditing={() =>
            this._destinationinput && this._destinationinput.focus()
          }
        />
        <TextInput
          style={{height: 40}}
          label="Destination"
          returnKeyType="next"
          value={destination.value}
          onChangeText={(text) => setDestination({value: text, error: ''})}
          error={!!destination.error}
          errorText={destination.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._destinationinput = ref;
          }}
          onSubmitEditing={() => this._weightinput && this._weightinput.focus()}
        />
        <TextInput
          style={{height: 40}}
          label="Weight"
          returnKeyType="next"
          value={weight.value}
          onChangeText={(text) => setWeight({value: text, error: ''})}
          error={!!weight.error}
          errorText={weight.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._weightinput = ref;
          }}
          onSubmitEditing={() =>
            this._dimensioninput && this._dimensioninput.focus()
          }
        />
        <TextInput
          style={{height: 40}}
          label="Dimensions"
          returnKeyType="next"
          value={dimensions.value}
          onChangeText={(text) => setDimensions({value: text, error: ''})}
          error={!!dimensions.error}
          errorText={dimensions.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._dimensioninput = ref;
          }}
          // onSubmitEditing={() =>
          //   this._weightinput && this._weightinput.focus()
          // }
        /> */
}
