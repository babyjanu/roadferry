import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import CHeader from '../../components/CHeader';
import { images } from '../../helper/Utils';
import ReferSuccessModal from '../../components/Customer/ReferSuccessModal';
import Colors from '../../helper/extensions/Colors';
import { RFPercentage, WidthPercentage } from '../../helper/extensions/Util';

const socialMediaArr = [
  {
    id: 1,
    name: 'Whatsapp',
    img: images.whatsappImg,
  },
  {
    id: 2,
    name: 'Instagram',
    img: images.instagramImg,
  },
  {
    id: 3,
    name: 'Facebook',
    img: images.facebookImg,
  },
  {
    id: 4,
    name: 'Twitter',
    img: images.twitterImg,
  },
  {
    id: 5,
    name: 'Telegram',
    img: images.telegramImg,
  },
  {
    id: 6,
    name: 'Skype',
    img: images.skypeImg,
  },
];

const ReferralScreen = props => {
  const [showReferSuccessModal, setShowReferSuccessModal] = useState(false);

  const userProfileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  const userUID = useSelector(state => state.fetchProfileData.userUID);

  const handleCopyBtn = () => {
    Clipboard.setString(userProfileData?.phone_number);
  };

  const handleSocialAppIconClick = () => {};

  return (
    <View style={styles.container}>
      <CHeader navigation={props?.navigation} headerTitle={'Referral'} />
      <View style={styles.subContainer}>
        <FastImage
          style={styles.referralImg}
          source={images.referralBannerImg}
          resizeMode="contain"
        />
        <Text style={styles.referTitleTxt}>{`Earn Money\nBy Refer`}</Text>
        <View style={styles.referCodeContainer}>
          <Text
            style={styles.referCodeTxt}
          >{`${userProfileData?.phone_number}`}</Text>
          <TouchableOpacity onPress={() => handleCopyBtn()}>
            <Text style={styles.normalTxt}>Copy</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.socialAppIconsContainer}>
          {socialMediaArr.map((s, i) => {
            return (
              <TouchableOpacity
                key={s?.id}
                style={styles.socialAppIconContainer}
                onPress={() => handleSocialAppIconClick()}
              >
                <FastImage
                  style={styles.socailAppIconImg}
                  source={s?.img}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </View> */}

        <ReferSuccessModal
          show={showReferSuccessModal}
          close={() => setShowReferSuccessModal(!showReferSuccessModal)}
          earnedAmount={50}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  referralImg: {
    width: WidthPercentage(100) - 32,
    height: 265,
  },
  referTitleTxt: {
    color: Colors.textColor,
    fontSize: RFPercentage(3.8),
    fontFamily: 'SofiaPro-Regular',
    textAlign: 'center',
  },
  referCodeTxt: {
    color: Colors.borderColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  normalTxt: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Bold',
  },
  referCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginVertical: 22,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 12,
  },
  socialAppIconsContainer: {
    flexDirection: 'row',
    rowGap: 12,
    columnGap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // alignContent: 'center',
    flexWrap: 'wrap',
  },
  socialAppIconContainer: {
    padding: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 16,
  },
  socailAppIconImg: {
    width: 45,
    height: 45,
  },
});

export default ReferralScreen;
