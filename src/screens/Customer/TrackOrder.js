// Import the Plugins and Thirdparty library.
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
// Import the JS file.
import Colors from '../../helper/extensions/Colors';
import MapViewDirections from 'react-native-maps-directions';
import AppConstants from '../../helper/constants/AppConstants';
import firestore from '@react-native-firebase/firestore';
import CHeader from '../../components/CHeader';

// Load the main class
const TrackOrder = (props) => {
    const params = props?.route?.params;
    const map = useRef();
    let orderData = params?.orderData;
    let pickupAddress = ""
    let pickupCoordinate;
    let dropAddress = ""
    let dropCoordinate = {
        latitude: "",
        longitude: ""
    };
    console.log('order data',orderData)
    if (orderData && orderData.data.pickup_location) {
        let pickupLocationData = orderData.data.pickup_location
        pickupAddress = `${pickupLocationData.flat_name}, ${pickupLocationData.area}, ${pickupLocationData.city}, ${pickupLocationData.state}, ${pickupLocationData.country} - ${pickupLocationData.pincode}`
        pickupCoordinate = pickupLocationData.coordinate
    }
    if (orderData && orderData.data.drop_location) {
        let dropLocationData = orderData.data.drop_location
        dropAddress = `${dropLocationData.flat_name}, ${dropLocationData.area}, ${dropLocationData.city}, ${dropLocationData.state}, ${dropLocationData.country} - ${dropLocationData.pincode}`
        dropCoordinate = dropLocationData.coordinate
    }
    console.log(`pickupCoordinate:`, pickupCoordinate)
    console.log(`dropCoordinate:`, dropCoordinate)

    const [getRegion, setGetRegion] = useState({
        latitude: 23.08571,
        longitude: 72.55132,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    });
    const driverMarkerRef = useRef();

    const [driverLocation, setDriverLocation] = useState({
        latitude: "",
        longitude:""
    });

    function onResult(QuerySnapshot) {
        console.log('Got Users collection result.', QuerySnapshot._data);
        if(QuerySnapshot._data?.coordinates){
            if(!QuerySnapshot._data?.coordinates) return;

            setDriverLocation(QuerySnapshot._data.coordinates)

            //smooth marker transition
            // const {latitude, longitude} = QuerySnapshot?._data?.coordinates;
            // if(driverMarkerRef && driverMarkerRef.current && latitude && longitude){
            //     driverMarkerRef.current?.animateMarkerToCoordinate({
            //         latitude: parseFloat(latitude),
            //         longitude: parseFloat(longitude)
            //     }, 500)
            // }
        }
    }
    map.current?.animateToRegion({
        latitude: driverLocation?.latitude,
        longitude: driverLocation?.longitude
    }, 500)

    function onError(error) {
        console.error(error);
    }

    const getDriverLocation = () => {
        console.log(`driver_details.user_uid: ${orderData.data.driver_details.user_uid}`)
        firestore()
            .collection('users')
            .doc(orderData.data.driver_details.user_uid)
            .onSnapshot(onResult, onError);
    }

    useEffect(() => {
        getDriverLocation()
    }, [orderData]);

    useEffect(() => {
        if(driverLocation && dropCoordinate) fitPadding()
    }, [orderData, driverLocation])

    const fitPadding = () => {
        map.current?.fitToCoordinates([driverLocation, dropCoordinate], {
            animated: true,
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Track Order'} />
            
            <MapView
                ref={map}
                style={styles.map}
                // provider={PROVIDER_GOOGLE}
                initialRegion={getRegion}
                // showsUserLocation={true}
                // onRegionChangeComplete={onRegionChange}
                // showsMyLocationButton={true}
            >
                 {/* {pickupCoordinate!=undefined && pickupCoordinate.latitude != 0 && pickupCoordinate.longitude != 0 ? 
                    <Marker
                        key={"pick"}
                        coordinate={{latitude:parseFloat(pickupCoordinate.latitude),longitude:parseFloat(pickupCoordinate.longitude)}}
                    />
                : null } */}
                {dropCoordinate && dropCoordinate.latitude && dropCoordinate.longitude ? 
                    <Marker
                        key={"drop"}
                        coordinate={{latitude:parseFloat(dropCoordinate.latitude),longitude:parseFloat(dropCoordinate.longitude)}}
                    />
                : null }
                {driverLocation && driverLocation.latitude && driverLocation.longitude ? 
                    <Marker.Animated
                        key={"driver"}
                        ref={driverMarkerRef}
                        coordinate={{latitude:parseFloat(driverLocation.latitude),longitude:parseFloat(driverLocation.longitude)}}
                        image={require('../../assets/assets/dashboard/delivery-truck.png')}
                    />
                : null }
                {/* {pickupCoordinate!=undefined && dropCoordinate!=undefined &&
                <MapViewDirections
                    origin={{latitude:parseFloat(pickupCoordinate.latitude),longitude:parseFloat(pickupCoordinate.longitude)}}
                    destination={{latitude:parseFloat(dropCoordinate.latitude),longitude:parseFloat(dropCoordinate.longitude)}}
                    apikey={AppConstants.google_place_api_key}
                    strokeWidth={4}
                    strokeColor={Colors.accentColor}
                    onError={(errorMessage) => {
                        console.log(`errorMessage:`, errorMessage)
                    }}
                />} */}
                {/* {pickupCoordinate!=undefined && driverLocation!=undefined &&
                <MapViewDirections
                    origin={{latitude:parseFloat(pickupCoordinate.latitude),longitude:parseFloat(pickupCoordinate.longitude)}}
                    destination={{latitude:parseFloat(driverLocation.latitude),longitude:parseFloat(driverLocation.longitude)}}
                    apikey={AppConstants.google_place_api_key}
                    strokeWidth={4}
                    strokeColor={Colors.accentColor}
                    onError={(errorMessage) => {
                        console.log(`errorMessage:`, errorMessage)
                    }}
                />} */}
                {(driverLocation && dropCoordinate && driverLocation.latitude && driverLocation.longitude && dropCoordinate.latitude && dropCoordinate.longitude) ?
                <MapViewDirections
                    origin={{latitude:parseFloat(driverLocation.latitude),longitude:parseFloat(driverLocation.longitude)}}
                    destination={{latitude:parseFloat(dropCoordinate.latitude),longitude:parseFloat(dropCoordinate.longitude)}}
                    apikey={AppConstants.google_place_api_key}
                    strokeWidth={4}
                    strokeColor={Colors.accentColor}
                    onError={(errorMessage) => {
                        console.log(`errorMessage:`, errorMessage)
                    }}
                /> : null}
            </MapView>
        </SafeAreaView>
    );
};

TrackOrder.navigationOptions = (navigationData) => {
    return {
        headerShown: true,
        headerTitle: 'Track Order',
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: Colors.mainBackgroundColor,
        },
        headerLeft: (
            <View style={styles.viewHeaderLeft}>
                <TouchableOpacity
                onPress={() => {
                    navigationData.navigation.goBack();
                }}>
                <Image
                    style={styles.menuImage}
                    source={require('../../assets/assets/Authentication/back.png')}
                />
                </TouchableOpacity>
            </View>
        ),
    };
};

// Set the components styles.

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewHeaderLeft: {
        paddingLeft: 16,
    },
    menuImage: {
        height: 40,
        width: 40,
    },
    viewHeaderRight: {
        paddingRight: 16,
        width: 64
    },
    map: {
        // flex: 1,
        height: Dimensions.get('window').height,
        // ...StyleSheet.absoluteFillObject,
    },
});

export default TrackOrder;