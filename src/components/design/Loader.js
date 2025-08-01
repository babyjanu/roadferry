import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import Colors from '../../helper/extensions/Colors';

const Loader = (props) => {
  const {loading, noModal, ...attributes} = props;

  return noModal ? (
      <View style={styles.background}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color={Colors.backgroundColor}
            animating={loading}
            size="large"
          />
        </View>
      </View>
    )
    :
    (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              color={Colors.backgroundColor}
              animating={loading}
              size="large"
            />
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.primaryColor,
    height: 75,
    width: 75,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});

export default Loader;
