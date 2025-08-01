import React, {useMemo, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Colors from '../helper/extensions/Colors';

const windowHeight = Dimensions.get('window').height;

const CBottomSheet = ({
  style,
  snapPoints,
  initiallyOpen = false,
  children,
  onClose,
}) => {
  // BottomSheet ref
  const bottomSheetRef = useRef(null);

  // Snap points (you can use numbers or percentages)
  const snapPointArray = useMemo(() => ['2%', '52%'], [snapPoints]);

  // Open and close logic
  const handleSheetChanges = useCallback(
    index => {
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose],
  );

  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  return (
    // <GestureHandlerRootView style={{ flex: 1,  }}>
      <BottomSheet
        ref={bottomSheetRef}
        index={initiallyOpen ? 0 : -1} // 0 means open initially, -1 means closed
        style={styles.bottomSheet}
        snapPoints={snapPointArray}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={{ flex: 1, paddingVertical: 12 }} /* contentContainerStyle={{ flexGrow: 1 }} */>
          {children}
        </BottomSheetView>
      </BottomSheet>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height / 2,
    position: 'absolute',
    bottom: 0,  // Position at the bottom of the screen or parent view
    left: 0,
    right: 0,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default CBottomSheet;