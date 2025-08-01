import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// Import the Plugins and Thirdparty library.

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';

// Load the main class.
const windowHeight = Dimensions.get('window').height;

const BottomSwipeSheet = (props) => {
  return (
    <View style={{flex: 1}}>
      <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
        componentType="FlatList"
        snapPoints={[100, '50%', windowHeight - 300]}
        initialSnapIndex={2}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
            <Text
              style={{...styles.vehicleText, paddingTop: 8, paddingBottom: 0}}>
              Choose a traspoter, or swipe up for more
            </Text>
          </View>
        )}
        data={Array.from({length: 20}).map((_, i) => String(i))}
        keyExtractor={(i) => i}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.traspoterText}>Traspoter name</Text>
            <View style={styles.priceView}>
              <Text style={styles.priceText}>₹ 350</Text>
              <Text style={styles.vehicleText}>Total KM : 50</Text>
            </View>
            <Text style={styles.vehicleText}>
              Vehicle : Truck, Ecco, Bolero, Marcel
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  item: {
    backgroundColor: Colors.backgroundColor,
    marginVertical: 8,
  },
  traspoterText: {
    padding: 8,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  vehicleText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(1.7),
    color: Colors.titleTextColor,
  },
});

export default BottomSwipeSheet;
