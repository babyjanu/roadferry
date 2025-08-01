import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../helper/extensions/Colors';
import CHeader from '../components/CHeader';

const BlankScreenTemplate = (props) => {
  return (
    <View style={styles.container}>
      <CHeader
        navigation={props?.navigation}
        headerTitle={'header Title'}
        isBackBtn={true}
      />
      
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor
  }
})

export default BlankScreenTemplate