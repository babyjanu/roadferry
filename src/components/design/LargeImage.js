import React from 'react';
import {StyleSheet, View, Modal, Dimensions, Image} from 'react-native';
import Colors from '../../helper/extensions/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import CModal from './CModal';

const windowWidth = Dimensions.get('window').width - 44;
const imageSize = 24

const LargeImage = (props) => {
  const {showLargeImage, onClosePressed, vehicleData, ...attributes} = props;
  //console.log(`vehicleData: ${JSON.stringify(vehicleData)}`)
  return (
    <CModal
      visible={showLargeImage}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {vehicleData && vehicleData.data && vehicleData.data.icon ?
            <FastImage
              style={[styles.vehicleImage, {resizeMode : "cover"}]}
              source={{
                uri: vehicleData.data.icon,
                width: windowWidth,
                height: windowWidth,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
              }}
            />
            : <Image
              style={styles.vehicleImage}
              source={require('../../assets/assets/dashboard/bike.png')}
          />}
          <View style={styles.closeIcon}>
            <Icon name="close" size={imageSize} color={"black"} onPress={onClosePressed} />
          </View>
        </View>
      </View>
    </CModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.primaryColor,
    height: windowWidth,
    width: windowWidth,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  closeIcon: {
    padding: 4,
    borderRadius: imageSize,
    backgroundColor: "white",
    position: "absolute",
    top: -(imageSize/2),
    right: -(imageSize/2)
  },
  vehicleImage: {
    height: windowWidth,
    width: windowWidth,
    borderRadius: 8,
    resizeMode: FastImage.resizeMode.contain
  }
});

export default LargeImage;
