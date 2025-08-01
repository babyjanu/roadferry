import {Dimensions} from 'react-native';
import AppConstants from '../constants/AppConstants';

export const defaultCoordinates = {
  // vadodara
  latitude: 22.3008,
  longitude: 73.15237,
}

export const stringValues = {
  rupeeSign: '\u20B9',
  supportMailTo: 'support@roadferry.in',
  supportCallTo: `${AppConstants.country_code}9925957045`,
};

export const Dimens = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const images = {
  searchIconImg: require('../../assets/assets/dashboard/search.png'),
  closeIconImg: require('../../assets/assets/close-outline.png'),

  pickupPin: require('../../assets/assets/pickupPin.png'),
  dropPin: require('../../assets/assets/dropPin.png'),

  referralBannerImg: require('../../assets/assets/images/referralImg.png'),
  referralSuccessImg: require('../../assets/assets/images/referralSuccessImg.png'),

  whatsappImg: require('../../assets/assets/images/SocialMediaImgs/whatsappImg.png'),
  instagramImg: require('../../assets/assets/images/SocialMediaImgs/instagramImg.png'),
  facebookImg: require('../../assets/assets/images/SocialMediaImgs/facebookImg.png'),
  twitterImg: require('../../assets/assets/images/SocialMediaImgs/twitterImg.png'),
  telegramImg: require('../../assets/assets/images/SocialMediaImgs/telegramImg.png'),
  skypeImg: require('../../assets/assets/images/SocialMediaImgs/skypeImg.png'),
  callImg: require('../../assets/assets/images/callImg.png'),
};

export const icons = {
  dashboardIcon: require('../../assets/assets/navigation/ic_dm_dashboard.png'),
  profileIcon: require('../../assets/assets/navigation/ic_dm_user.png'),
  driverIcon: require('../../assets/assets/navigation/ic_dm_driver.png'),
  parcelHistoryIcon: require('../../assets/assets/navigation/ic_dm_parcelHistory.png'),
  vehicleIcon: require('../../assets/assets/navigation/ic_dm_vehicle.png'),
  contactUsIcon: require('../../assets/assets/navigation/ic_dm_contactus.png'),
  referralIcon: require('../../assets/assets/navigation/ic_dm_vehicle.png'),
  logoutIcon: require('../../assets/assets/navigation/ic_dm_logout.png'),
  editIcon2: require('../../assets/assets/ic_edit2.png'),
  callImg: require('../../assets/assets/images/callImg.png')
};
