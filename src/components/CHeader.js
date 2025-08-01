import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import Colors from '../helper/extensions/Colors';
import FastImage from 'react-native-fast-image';
import {RFPercentage} from '../helper/extensions/Util';

const CHeader = ({
  navigation,
  showLogo,
  headerTitle,
  isBackBtn,
  handleBackBtnClick,
  rightComponent,
  handleRightBtnClick,
  isBackgroundTransparent
}) => {
  return (
    <View style={{ ...styles.headerContainer, backgroundColor: isBackgroundTransparent ? 'transparent' : Colors.mainBackgroundColor }}>
      {!isBackBtn ? (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <FastImage
            style={styles.menuImage}
            source={require('../assets/assets/dashboard/ic_menu.png')}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            !!handleBackBtnClick ? handleBackBtnClick() : navigation.goBack();
          }}
        >
          <FastImage
            style={styles.menuImage}
            source={require('../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      )}

      <View style={styles.viewHeaderCenter}>
        {headerTitle ? (
          <Text style={styles.headerTitleTxt}>{headerTitle}</Text>
        ) : null}

        {showLogo ? (
          <FastImage
            style={{width: 100, height: 30, marginStart: 14}}
            source={require('../assets/assets/Authentication/logo.png')}
            resizeMode="contain"
          />
        ) : null}
      </View>

      {rightComponent ? (
        <View style={styles.viewHeaderRight}>{rightComponent}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get('window').width,
    // height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleTxt: {
    marginLeft: 16,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2.6),
    fontWeight: 'bold',
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  viewHeaderRight: {
    // flex: 1,
    alignItems: 'center',
    // alignSelf: 'flex-end',
    // justifyContent: 'flex-end'
  },
});

export default CHeader;
