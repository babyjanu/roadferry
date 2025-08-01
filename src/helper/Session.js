import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppPreference from './preference/AppPreference';

export default class Session extends Component {

    static async saveValue(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    static async saveObject(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    static async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    static async removeAll() {
        try {
            let keys = await AsyncStorage.getAllKeys()
            //console.log(`keys_1: ${keys}`)
            for (let i = 0; i < keys.length; i++) {
                let keyName = keys[i];
                if (keyName !== AppPreference.FCM_TOKEN &&
                    keyName !== AppPreference.IS_SLIDER) {
                    await AsyncStorage.removeItem(keyName);
                }
            }
            ////console.log(`keys_2: ${keys}`)
            //await AsyncStorage.clear()
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }
}