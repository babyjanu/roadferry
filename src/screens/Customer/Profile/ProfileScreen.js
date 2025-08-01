import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import ProfileButton from '../../../components/Customer/Profile/ProfileButton';
import ProfileData from '../../../components/Customer/Profile/ProfileData';
import * as fetchProfileDataActions from '../../../store/actions/customer/profile/fetchProfileData';
import AppPreference from '../../../helper/preference/AppPreference';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CHeader from '../../../components/CHeader';

// Load the main class.

const ProfileScreen = props => {
  const profileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  console.log(`profileData: ${JSON.stringify(profileData)}`);

  let userUID = useSelector(state => state.fetchProfileData.userUID);
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`ProfileScreen.userUID: ${userUID}`);

  const checkAndNavigateToLogin = () => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
      const isLogin = JSON.parse(valueLogin);
      console.log('Login Value is : ', isLogin);
      if (isLogin != 1) {
        props.navigation.navigate('Auth');
      }
    });
  };

  const dispatch = useDispatch();
  const fetchProfileData = useCallback(async () => {
    checkAndNavigateToLogin();
    try {
      dispatch(fetchProfileDataActions.fetchProfileData(userUID));
    } catch (err) {
      console.log('Error is : ', err);
    }
  }, [dispatch, userUID]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'focus',
      fetchProfileData,
    );

    return () => {
      willFocusSub();
    };
  }, [fetchProfileData]);

  useEffect(() => {
    // setIsLoading(true);
    fetchProfileData().then(() => {
      // setIsLoading(false);
    });
  }, [dispatch, fetchProfileData]);

  const loadProfileImage = () => {
    let image = '';
    let tProfileData = {...profileData};
    if (tProfileData != undefined) {
      // console.log(`tProfileData.driver_photo.base64:`, tProfileData.driver_photo.base64)
      if (tProfileData.customer_photo) {
        image =
          typeof tProfileData.customer_photo === 'string'
            ? tProfileData.customer_photo
            : `data:${tProfileData.customer_photo.type};base64,${tProfileData.customer_photo.base64}`;
      }
    }
    // console.log(`image: ${image}`)
    return image == '' ? (
      <Image
        style={styles.imageLogo}
        source={require('../../../assets/assets/default_user.png')}
      />
    ) : (
      <Image style={styles.imageLogo} source={{uri: image}} />
    );
  };

  return (
    <View style={styles.container}>
      <CHeader
        navigation={props.navigation}
        headerTitle={'My Profile'}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('EditProfile');
            }}
          >
            <Text
              style={{
                marginRight: 16,
                color: Colors.titleTextColor,
                fontSize: RFPercentage(2),
                fontFamily: 'SofiaPro-SemiBold',
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {loadProfileImage()}
          {/* <Text style={styles.titleText}>Prashant Siddhpura</Text> */}
        </View>
        <View style={{marginTop: 32}}>
          <ProfileData
            keyName="First Name"
            valueName={profileData ? profileData.first_name : ''}
          />
          <ProfileData
            keyName="Last Name"
            valueName={profileData ? profileData.last_name : ''}
          />
          <ProfileData
            keyName="Email"
            valueName={profileData ? profileData.email : ''}
          />
          <ProfileData
            keyName="Phone"
            valueName={profileData ? profileData.phone_number : ''}
          />
        </View>
        {/* <TouchableOpacity
          style={styles.cardView}
          onPress={() => {
            props.navigation.navigate('ChangePasswordscreen')
          }}>
          <Text style={styles.keyText}>Change Password</Text>
          <Icon name="keyboard-arrow-right" size={24} />
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

ProfileScreen.navigationOptions = navigationData => {
  return {
    headerShown: true,
    headerTitle: 'My Profile',
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
            navigationData.navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_menu.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.navigate({
              routeName: 'EditProfile',
            });
          }}
        >
          <Text
            style={{
              marginRight: 16,
              color: Colors.titleTextColor,
              fontSize: RFPercentage(2),
              fontFamily: 'SofiaPro-SemiBold',
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  changePasswordView: {
    margin: 16,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  imageLogo: {
    marginTop: 32,
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    // backgroundColor: Colors.inputTextBackgroundColor,
  },
  titleText: {
    marginTop: 16,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    marginTop: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  cardView: {
    margin: 16,
    marginTop: 24,
    backgroundColor: Colors.backgroundColor,
    /* shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5, */
    borderRadius: 5,
    padding: 8,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  keyText: {
    flex: 1,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
});

export default ProfileScreen;
