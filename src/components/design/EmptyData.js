import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Colors from '../../helper/extensions/Colors';
import Button from './Button';

const EmptyData = (props) => {
  return (
    <View style={styles.root}>
      <View style={styles.rootData}>
        {/* <Image
          style={styles.image}
          source={require('../../assets/assets/Comman/empty_bg.png')}
        /> */}
        <Text style={styles.textMessage}>Your {props.data} is
          <Text style={{ color: Colors.primaryColor, fontWeight: 'bold' }}>
            {` empty`}
          </Text>
        </Text>
        <Button labelStyle={styles.buttonLabel} style={styles.button} mode="contained" onPress={props.tryAgain}>
          Refresh
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rootData: {
    borderRadius: 10,
    borderWidth: 0.2,
    padding: 12,
    borderColor: '#82848f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMessage: {
    // fontFamily: 'Futura-Medium',
    fontSize: 20,
    marginTop: 8,
    color: '#82848f',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  button: {
    width: 120,
    marginTop: 12,
    backgroundColor: '#82848f',
  },
  buttonLabel: {
    // fontFamily: 'Futura-Bold',
    fontSize: 14
  },
  image: {
    height: 200,
    width: 175,
  },
});

export default EmptyData;
