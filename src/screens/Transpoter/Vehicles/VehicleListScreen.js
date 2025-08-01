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

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {OrderHistroyData} from '../../../helper/extensions/dummyData';
import SwipableButtons from '../../../components/transpoter/Drivers/SwipableButton';

import * as getVehicleDataAction from '../../../store/actions/transporter/vehicle/getVehicleData';
import Loader from '../../../components/design/Loader';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppConstants from '../../../helper/constants/AppConstants';
import firestore from '@react-native-firebase/firestore';
// Load the main class.

const VehicleListScreen = (props) => {
  const userID = 'B4Ti8IgLgpsKZECGqOJ0';

  const isLoading = useSelector(
    (state) => state.transporterVehicleData.isLoading,
  );
  const vehicleList = useSelector(
    (state) => state.transporterVehicleData.vehicleData,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    getVehicleList(true);
  }, [dispatch]);

  const getVehicleList = (isStartProgress) => {
    try {
      dispatch(getVehicleDataAction.fetchVehicleList(userID, isStartProgress));
    } catch (err) {
      console.log(`getVehicleDataAction.fetchVehicleList.error: ${err}`);
    }
  };

  const openEditVehicleScreen = (itemData) => {
    props.navigation.navigate({
      routeName: 'AddVehicleScreen',
      params: {
        isEdit: true,
        vehicleData: itemData.item,
        refreshData: () => {
          getVehicleList(true);
        },
      },
    })
  }

  const pressDeleteButton = (item, index) => {
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
            firestore()
            .collection('users')
            .doc(userID)
            .collection('vehicle_details')
            .doc(item.id)
            .delete()
            .then(() => {
              console.log('User deleted!');
              getVehicleList(true)
            }).catch(error => {
              console.log(`pressDeleteButton.error:`,error)
            });
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderDriverData = (itemData, index) => {
    let tVehiclePhotosList = [...itemData.item.data.vehicle_photos]
    // console.log(`tVehiclePhotosList[0].base64.1`, tVehiclePhotosList[0].base64)
    let base64Value = tVehiclePhotosList[0].base64.toBase64()
    // console.log(`tVehiclePhotosList[0].base64.2`, tVehiclePhotosList[0].base64)
    let color = itemData.item.data.status === AppConstants.vehicleStatusVerifiedKey ? 'green' : 'gray'
    return (
      <Swipeable
        renderRightActions={() => (
          <SwipableButtons editButton={() => openEditVehicleScreen(itemData)} deleteButton={() => pressDeleteButton(itemData.item, index)} />
        )}>
        <TouchableOpacity style={styles.driverView}
          onPress={() => openEditVehicleScreen(itemData)}>
          <Image
            style={styles.driverImage}
            source={{uri: `data:${tVehiclePhotosList[0].type};base64,${base64Value}`}}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>{itemData.item.data.vehicle_type}</Text>
            <Text style={styles.subTitleText}>{itemData.item.data.vehicle_number}</Text>
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
        data={vehicleList}
        renderItem={renderDriverData}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.addDriverView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'AddVehicleScreen',
            refreshData: () => {
              getVehicleList(true);
            }
          })
        }>
        <Text style={styles.addDriverText}>ADD VEHICLE</Text>
      </TouchableOpacity>
      <Loader loading={isLoading} />
    </View>
  );
};

VehicleListScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Vehicles',
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
    // marginBottom: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Bold',
  },
  subTitleText: {
    marginTop: 4,
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

export default VehicleListScreen;
