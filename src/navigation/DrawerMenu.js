import {View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../helper/extensions/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/firestore';
import Session from '../helper/Session';
import {icons} from '../helper/Utils';
import {RFPercentage, WidthPercentage, height} from '../helper/extensions/Util';
import * as fetchProfileDataActions from '../store/actions/customer/profile/fetchProfileData';
import { updateUserDetails_firestore } from '../helper/Utils/fireStoreUtils';

var isLoginUser = false;
export const setIsLoginUser = tIsLoginUser => {
  isLoginUser = tIsLoginUser;
};

export const getIsLoginUser = () => {
  return isLoginUser;
};

const DrawerMenu = props => {

  const dispatch = useDispatch();
  const profileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  let userId = useSelector(state => state.fetchProfileData.userUID);

  // Fetch profile data on mount and when userId changes
  React.useEffect(() => {
    if (userId) {
      dispatch(fetchProfileDataActions.fetchProfileData(userId));
    }
  }, [userId, dispatch]);

  const handleLogoutClicked = () => {
    if (userId) {
      Alert.alert(
        'Confirmation',
        'Do you want to logout?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              return null;
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              dispatch(fetchProfileDataActions.clearProfileData());
              // firebase.auth().signOut();
              Session.removeAll();
              updateUserDetails_firestore(userId, { fcm_token: '' });
              props.navigation.navigate('Auth');
              props.navigation.toggleDrawer();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      props.navigation.navigate('Auth');
    }
  };

  let menuItems = [];
  if (!userId) {
    menuItems.push({
      id: '1',
      name: 'Sign In / Sign Up',
      itemIcon: icons.logoutIcon,
      // nextIcon: require("../assets/icons/icons/next.png"),
      onpress: () => {
        props.navigation.navigate('Auth');
      },
    });
  }
  menuItems.push({
    id: '2',
    name: 'Dashboard',
    itemIcon: icons.dashboardIcon,
    //   nextIcon: require("../assets/icons/icons/next.png"),
    onpress: () => {
      props.navigation.navigate('DashboardTraking');
    },
  });
  menuItems.push({
    id: '3',
    name: 'My Profile',
    itemIcon: icons.profileIcon,
    //   nextIcon: require("../assets/icons/icons/next.png"),
    onpress: () => {
      if (userId) {
        props.navigation.navigate('ProfileScreen');
      } else {
        props.navigation.navigate('Auth');
      }
    },
  });
  menuItems.push({
    id: '4',
    name: 'Parcel History',
    itemIcon: icons.parcelHistoryIcon,
    //   nextIcon: require("../assets/icons/icons/next.png"),
    onpress: () => {
      if (userId) {
        props.navigation.navigate('OrderHistoryScreen');
      } else {
        props.navigation.navigate('Auth');
      }
    },
  });
  menuItems.push({
    id: '5',
    name: 'Support',
    itemIcon: icons.contactUsIcon,
    //   nextIcon: require("../assets/icons/icons/next.png"),
    onpress: () => {
      props.navigation.navigate('SupportScreen');
    },
  });
  menuItems.push({
    id: '6',
    name: 'Terms of Services',
    itemIcon: () => {
      return(
        <Icon
          name="description"
          size={30}
          color={Colors.lightGreyOrange}
        />
      )
    },
    onpress: () => {
      props.navigation.navigate('TermsOfServicesScreen');
    },
  });
  menuItems.push({
    id: '7',
    name: 'Privacy policy',
    itemIcon: () => {
      return(
        <Icon
          name="policy"
          size={30}
          color={Colors.lightGreyOrange}
        />
      )
    },
    onpress: () => {
      props.navigation.navigate('PrivacyPolicyScreen');
    },
  });
  if (userId) {
    menuItems.push({
      id: '8',
      name: 'Referral',
      itemIcon: () => {
        return(
          <Icon
            name="forum"
            size={30}
            color={Colors.lightGreyOrange}
          />
        )
      },
      onpress: () => {
        props.navigation.navigate('ReferralScreen');
      },
    });
  }

  const userImage = () => {
    let image = '';
    if (profileData != undefined) {
      if (profileData.customer_photo) {
        image =
          typeof profileData.customer_photo === 'string'
            ? profileData.customer_photo
            : `data:${profileData.customer_photo.type};base64,${profileData.customer_photo.base64}`;
      }
    }
    return image == '' ? (
      <View style={{ ...styles.userProfileImg, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accentColor }}>
        <Text style={{ ...styles.itemText, marginStart: 0 }}>
          {`${profileData?.first_name.split('')[0]}${
            profileData?.last_name.split('')[0]
          }`}
        </Text>
      </View>
    ) : (
      <FastImage source={{uri: image}} style={styles.userProfileImg} />
    );
  };

  const handleEditBtn = () => {
    props.navigation.navigate('EditProfile');
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.headerSection}>
            {userId ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.userImgBorder}>
                  {userImage()}
                  <TouchableOpacity
                    style={styles.editIconContainer}
                    onPress={() => handleEditBtn()}
                  >
                    <FastImage
                      source={icons.editIcon2}
                      style={styles.editIconImg}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.userTxtInfoContainer}>
                  <Text style={styles.itemText}>
                    {`${profileData?.first_name} ${profileData?.last_name}`}
                  </Text>
                  <Text
                    style={{
                      ...styles.itemText,
                      fontSize: RFPercentage(1.8),
                      width: WidthPercentage(50) - 40,
                    }}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                  >
                    {`${profileData?.email}`}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
            {menuItems.map((m, i) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  key={i}
                  style={styles.itemContainer}
                  onPress={m.onpress}
                >
                  {m.id === '1' ? (
                    <Icon
                      name="login"
                      size={30}
                      color={Colors.lightGreyOrange}
                    />
                  ) : ( typeof (m.itemIcon) === "function" ) ? 
                    <>
                      {m.itemIcon()}
                    </>
                    : (
                    <FastImage style={styles.itemIconImg} source={m.itemIcon} />
                  )}
                  <Text style={styles.itemText}>{m.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {userId ? (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                ...styles.itemContainer,
                position: 'absolute',
                bottom: 0,
                left: 20,
              }}
              onPress={() => handleLogoutClicked()}
            >
              <FastImage style={styles.itemIconImg} source={icons.logoutIcon} />
              <Text style={styles.itemText}>Logout</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    height: height - 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerSection: {
    flexDirection: 'row',
    // marginTop: 30,
    alignItems: 'flex-start',
  },
  userImgBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.lightGreyOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userProfileImg: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  editIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    bottom: 0,
    backgroundColor: Colors.lightGreyOrange,
  },
  editIconImg: {
    width: 18,
    height: 18,
  },
  userTxtInfoContainer: {
    rowGap: 4,
    marginStart: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 18,
    marginTop: 6,
    fontWeight: 'bold',
    color: 'white',
  },
  title2: {
    fontSize: 14,
    lineHeight: 16,
    marginTop: 0,
    color: 'white',
  },
  contentSection: {
    marginVertical: 40,
  },
  itemContainer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    fontSize: RFPercentage(2.2),
    fontWeight: '500',
    marginStart: 12,
    color: 'white',
  },
  itemStartIcon: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemEndIcon: {
    width: 20,
    height: 20,
  },
  userImgContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // for shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  itemIconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default DrawerMenu;
