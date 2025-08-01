import {Modal, TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { Dimens, images, stringValues } from '../../helper/Utils';
import Colors from '../../helper/extensions/Colors';
import { RFPercentage } from '../../helper/extensions/Util';
import CModal from '../design/CModal';

const ReferSuccessModal = ({navigation, children, show, close, earnedAmount, handleReferAnotherBtn}) => {
  return (
    <CModal visible={show} onClose={close}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalView}
        onPress={() => close()}
      >
        <View style={styles.modalSubContainer}>
          <FastImage style={styles.referSuccesImg} source={images.referralSuccessImg} resizeMode='contain' />
          
          <Text style={{ ...styles.titleTxt, paddingVertical: 12, marginTop: 12 }}>
            {`Congratulations! You have just earned ${stringValues.rupeeSign}${(earnedAmount)}`}
          </Text>
          <Text style={styles.descTxt}>
            {`One of your friends has joined by your\nreferral code. Do more invitations to earn\nmore.`}
          </Text>

          <TouchableOpacity style={styles.btn} onPress={() => close()}>
            <Text style={styles.btnTxt}>Refer Another</Text>
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    </CModal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    width: Dimens.width,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSubContainer: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: Colors.blueColor
  },
  referSuccesImg: {
    width: 300,
    height: 265,
  },
  titleTxt: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(3),
    fontFamily: 'SofiaPro-Bold',
    textAlign: 'center',
  },
  descTxt: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 28,
    borderRadius: 30,
    alignSelf: 'center'
  },
  btnTxt: {
    color: Colors.textColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
    textAlign: 'center',
  }
});

export default ReferSuccessModal;
