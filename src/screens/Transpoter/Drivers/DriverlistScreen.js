import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../../components/design/Loader';

import firestore from '@react-native-firebase/firestore';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {OrderHistroyData} from '../../../helper/extensions/dummyData';
import SwipableButtons from '../../../components/transpoter/Drivers/SwipableButton';
import * as getDriverDataAction from '../../../store/actions/transporter/driver/getDriverData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppConstants from '../../../helper/constants/AppConstants';

// Load the main class.

const DriverlistScreen = (props) => {
  const userID = 'B4Ti8IgLgpsKZECGqOJ0';
  // const [isLoading, setIsLoading] = useState(false);
  const isLoading = useSelector(
    (state) => state.transporterDriverData.isLoading,
  );
  const driverList = useSelector(
    (state) => state.transporterDriverData.driverData,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    getDriverList(true);
  }, [dispatch]);

  const getDriverList = (isStartProgress) => {
    try {
      dispatch(getDriverDataAction.fetchDriverList(userID, isStartProgress));
    } catch (err) {
      console.log(`getDriverDataAction.fetchDriverList.error: ${err}`);
    }
  };

  /* console.log(`getDriverList:`, driverList)
  if (driverList.length == 0) {
    props.navigation.navigate({
      routeName: 'AddDriverScreen',
      params: {
        refreshData: () => {
          getDriverList(true)
        }
      }
    })
  } */

  const pressDeleteButton = (item, index) => {
    console.log(`pressDeleteButton.item.id: ${item.id}`)
    Alert.alert(
      'Alert',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Deleted!');
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            // setIsLoading(true)
            // isLoading = true
            firestore().collection('users').doc(item.data.user_uid).delete().then(()=> {
              firestore()
              .collection('users')
              .doc(userID)
              .collection('driver_details')
              .doc(item.id)
              .delete()
              .then(() => {
                console.log('User deleted!');
                getDriverList(true)
              });
            }).catch(error => {
              console.log(`pressDeleteButton.error:`,error)
            })
          },
        },
      ],
      {cancelable: true},
    );
  };

  const openEditDriver = (itemData) => {
    props.navigation.navigate({
      routeName: 'AddDriverScreen',
      params: {
        isEdit: true,
        driverData: itemData.item,
        refreshData: () => {
          getDriverList(true);
        },
      },
    })
  }

  const renderDriverData = (itemData, index) => {
    /* let data = `${itemData.item.driver_photo.data}`
    console.log(`data: ${data.toBase64}`)
    console.log(`type: ${itemData.item.driver_photo.type}`) */
    if (itemData.item.data.driver_photo.base64 == undefined) {
      return
    }
    let color = itemData.item.data.status === AppConstants.driverStatusVerifiedKey ? 'green' : 'gray'
    return (
      <Swipeable
        renderRightActions={() => (
          <SwipableButtons editButton={() => openEditDriver(itemData)} deleteButton={() => pressDeleteButton(itemData.item, index)} />
        )}>
        <TouchableOpacity
          style={styles.driverView}
          onPress={() =>
            openEditDriver(itemData)
          }>
          <Image
            style={styles.driverImage}
            // source={require('../../../assets/assets/dashboard/parcelImage.jpeg')}
            source={{uri: `data:${itemData.item.data.driver_photo.type};base64,${itemData.item.data.driver_photo.base64.toBase64()}`}}
          />
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>
              {itemData.item.data.first_name} {itemData.item.data.last_name}
            </Text>
            <Text style={styles.subTitleText}>
              {itemData.item.data.phone_number}
            </Text>
          </View>
          <View
            style={{
              marginRight: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="check-circle-outline" size={24} color={color} />
            <Text style={[styles.subTitleText, {color: color}]}>
              {itemData.item.data.status}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        // style={{marginTop: 16, marginBottom: 16}}
        keyExtractor={(item, index) => item.id}
        data={driverList}
        renderItem={renderDriverData}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.addDriverView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'AddDriverScreen',
            params: {
              refreshData: () => {
                getDriverList(true);
              },
            },
          })
        }>
        <Text style={styles.addDriverText}>ADD DRIVER</Text>
      </TouchableOpacity>
      <Loader loading={isLoading} />
    </View>
  );
};

DriverlistScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Drivers',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
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
    height: 40,
    width: 40,
  },
  driverView: {
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  driverImage: {
    margin: 16,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  titleText: {
    marginTop: -8,
    // marginBottom: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Bold',
  },
  subTitleText: {
    marginTop: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  itemRow: {
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addDriverView: {
    margin: 16,
    height: 50,
    borderRadius: 25,
    // borderColor: Colors.primaryColor,
    // borderWidth: 0.5,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDriverText: {
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.backgroundColor,
  },
});

export default DriverlistScreen;
