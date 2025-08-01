import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

// Import the Plugins and Thirdparty library.

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AppConstants from '../../helper/constants/AppConstants';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';

// Load the main class.

/* const _onChangeTextValue = (text) => {
  console.log(`_onChangeTextValue:`, text)
} */

const GooglePlacesTextInput = (props) => {
  const ref = useRef();
  const {placeholder, setAddressText, soureValue, destinationValue, addressValue, customStyles} = props;
  
  useEffect(() => {
    if (setAddressText != '') {
      // console.log(`setAddressText:`, setAddressText)
      ref.current?.setAddressText(setAddressText);
    }
  });

  return (
    <View style={{ flex: 1, marginLeft: 0 }}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        minLength={3}
        returnKeyType={'next'}
        listViewDisplayed="auto"
        fetchDetails={true}
        renderDescription={(row) => row.description}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          // console.log(`data: ${JSON.stringify(data.description)}`)
          // console.log(`details: ${JSON.stringify(details)}`)
          if (placeholder === 'Pickup Location') {
            soureValue(
              data.description,
              details.geometry.location.lat,
              details.geometry.location.lng,
              data,
              details
            );
          } else if (placeholder === 'Destination') {
            destinationValue(
              data.description,
              details.geometry.location.lat,
              details.geometry.location.lng,
              data,
              details
            );
          } else {
            addressValue(
              data,
              details
            );
          }
          // console.log('Data is :', data);
          // console.log('Details is :', details);
          // console.log('Location is :', details.geometry.location);
          console.log('Latitude is :', details.geometry.location.lat);
          console.log('Longitude is :', details.geometry.location.lng);
        }}
        onNotFound={() => {
          console.log(`onNotFound`)
        }}
        // getDefaultValue={(data) => {
        //   if (placeholder === 'Source') {
        //     soureValue(data);
        //   } else {
        //     destinationValue(data);
        //   }
        // }}
        query={{
          key: AppConstants.google_place_api_key,
          language: 'en',
          components: 'country:in',
          // types: 'address'
        }}
        // currentLocation={true}
        // currentLocationLabel="Current location"
        enablePoweredByContainer={false}
        GooglePlacesDetailsQuery={{
          types: ["street_number", "street_address"],
          // fields: ['formatted_address', 'geometry'],
        }}
        // setAddressText={(text) => soureValue(text)}
        styles={{
          container: {
            flex: 0
          },
          textInputContainer: {
            // backgroundColor: Colors.subViewBGColor,
            height: 45,
            borderRadius: 10,
          },
          textInput: {
            height: 45,
            color: Colors.textColor,
            fontSize: RFPercentage(2),
            // opacity: 0.6,
            // fontSize: 16,
            fontFamily: 'SofiaPro-Regular',
            // fontSize: RFPercentage(1.8),
            backgroundColor: Colors.subViewBGColor,
            borderRadius: 10,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          ...customStyles
        }}
        {...props}
      />
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
});

export default GooglePlacesTextInput;
