import React, {createRef, useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import AppConstants from '../../helper/constants/AppConstants';
import Colors from '../../helper/extensions/Colors';

const GooglePlacesSearchTxtInput = (props) => {
  const ref = createRef();
  const {placeholder, customStyles, onSelectLocation, debounce = 200 } = props;
  
  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    const address = data.description;

    // Pass the location details to the parent via callback
    onSelectLocation({ lat, lng, address });
    ref.current?._handleChangeText('');
  };

  return (
    <View style={{ flex: 1, marginLeft: 0 }}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        minLength={3}
        returnKeyType={'next'}
        listViewDisplayed="auto"
        keyboardShouldPersistTaps={"always"}
        // textInputProps={{ /* selection: { start: 1, end: 1 }, */ clearButtonMode: "while-editing" }}
        fetchDetails={true}
        debounce={debounce}
        renderDescription={(row) => row.description}
        onPress={handleLocationSelect}
        onNotFound={() => {
          console.log(`onNotFound`)
        }}
        query={{
          key: AppConstants.google_place_api_key,
          language: 'en',
          components: 'country:in',
        }}
        enablePoweredByContainer={false}
        GooglePlacesDetailsQuery={{
          // types: ["street_number", "street_address"],
          fields: 'geometry,name'
          // fields: ['formatted_address', 'geometry'],
        }}
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
            fontFamily: 'SofiaPro-Regular',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
});

export default GooglePlacesSearchTxtInput;
