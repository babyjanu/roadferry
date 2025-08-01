import {View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import React, { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFPercentage} from '../../helper/extensions/Util';
import Colors from '../../helper/extensions/Colors';
import { Dimens } from '../../helper/Utils';

const windowWidth = Dimensions.get('window').width;

const CModal = ({
  visible,
  onClose,
  isBottomModal = false,
  children
}) => {
  const slideAnim = new Animated.Value(500);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Sliding the modal up from the bottom and faded in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Sliding the modal down and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[ isBottomModal ? styles.bottomedView : styles.centeredView, { opacity: fadeAnim, backgroundColor: 'rgba(0, 0, 0, 0.4)' } ]}
        // onPress={onClose}
      >
        <Animated.View
          style={[ isBottomModal ? styles.bottomedView : styles.centeredView, { transform: [{ translateY: slideAnim }] } ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomedView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default CModal;
