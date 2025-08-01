import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  Linking,
} from "react-native";

// Import the Plugins and Thirdparty library.
import { RFPercentage } from "react-native-responsive-fontsize";

// Import the JS file.

import Colors from "../../../helper/extensions/Colors";
import ProfileButton from "../../../components/Customer/Profile/ProfileButton";
import TextInput from "../../../components/design/TextInput";
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  lastNameValidator,
  commentValidator,
  titleValidator,
  subjectValidator,
} from "../../../helper/extensions/Validator";
import Loader from "../../../components/design/Loader";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppPreference from "../../../helper/preference/AppPreference";
import CHeader from "../../../components/CHeader";
import { stringValues } from "../../../helper/Utils";
import CModal from "../../../components/design/CModal";
// Load the main class.

const windowWidth = Dimensions.get("window").width;

const SupportScreen = (props) => {
  let userUID = useSelector((state) => state.fetchProfileData.userUID);
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`TranspoterDashboardScreen.userUID: ${userUID}`);

  const checkAndNavigateToLogin = () => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
      const isLogin = JSON.parse(valueLogin);
      console.log("Login Value is : ", isLogin);
      if (isLogin != 1) {
        props.navigation.navigate("Auth");
      }
    });
  };

  /* useEffect(() => {
    checkAndNavigateToLogin();
  }); */

  const [title, setTitle] = useState({ value: "", error: "" });
  const [subject, setSubject] = useState({ value: "", error: "" });
  const [comment, setComment] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  const onPressSubmit = () => {
    const commentError = commentValidator(comment.value);
    const titleError = titleValidator(title.value);
    const subjectError = subjectValidator(subject.value);

    if (titleError) {
      setTitle({ ...title, error: titleError });
      return;
    } else if (subjectError) {
      setSubject({ ...subject, error: subjectError });
      return;
    } else if (commentError) {
      setComment({ ...comment, error: commentError });
      return;
    } else {
      setIsLoading(true);
      firestore()
        .collection("contact_details")
        .add({
          title: title.value,
          subject: subject.value,
          comment: comment.value,
          contact_by: userUID,
          created_at: new Date(),
        })
        .then(() => {
          setIsLoading(false);
          setPopup(true);
        })
        .catch((error) => {
          console.log(`error:`, error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <CHeader navigation={props.navigation} headerTitle={'Contact Us'} />
      <View style={{ padding: 16 }}>
        <TextInput
          label="Title"
          returnKeyType="next"
          value={title.value}
          onChangeText={(text) => setTitle({ value: text, error: "" })}
          error={!!title.error}
          errorText={title.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._titleinput = ref;
          }}
          onSubmitEditing={() =>
            this._subjectinput && this._subjectinput.focus()
          }
          multiline
        />
        <TextInput
          label="Subject"
          returnKeyType="next"
          value={subject.value}
          onChangeText={(text) => setSubject({ value: text, error: "" })}
          error={!!subject.error}
          errorText={subject.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._subjectinput = ref;
          }}
          onSubmitEditing={() => this._writeinput && this._writeinput.focus()}
          multiline
        />
        <TextInput
          label="Write here"
          returnKeyType="next"
          value={comment.value}
          onChangeText={(text) => setComment({ value: text, error: "" })}
          error={!!comment.error}
          errorText={comment.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._writeinput = ref;
          }}
          onSubmitEditing={Keyboard.dismiss}
          multiline
        />
      </View>
      <TouchableOpacity
        style={styles.supportView}
        onPress={() => onPressSubmit()}
      >
        <Text style={styles.supportText}>SEND</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>
      <View style={styles.contactDetailMainView}>
        <Text style={styles.contactTitleText}>
          Have more queries contact us{" "}
        </Text>
        <Text style={styles.contactValueTextContainer}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${stringValues.supportCallTo}`);
            }}
          >
            <Text style={styles.contactValueText}>
              {`${stringValues.supportCallTo}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.contactValueText, {textDecorationLine: "none"}]}> (or) </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`mailto:${stringValues.supportMailTo}`);
            }}
          >
            <Text style={styles.contactValueText}>
              {`${stringValues.supportMailTo}`}
            </Text>
          </TouchableOpacity>
        </Text>
      </View>

      <CModal visible={popup}>
        <View style={styles.centeredView}>
          <View style={styles.popupView}>
            <Image
              style={styles.clickImage}
              source={require("../../../assets/assets/PlaceOrder/checkout_click.png")}
            />
            <Text
              style={{ ...styles.totalAmountText, textAlign: "center" }}
            >
              Thank you, Your submission has been sent.
            </Text>
            <TouchableOpacity
              style={styles.okayButtonView}
              onPress={() => {
                setTitle({ value: "", error: "" });
                setSubject({ value: "", error: "" });
                setComment({ value: "", error: "" });
                setPopup(false);
              }}
            >
              <Text style={styles.placeOrderText}>OKAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CModal>

      <Loader loading={isLoading} />
    </View>
  );
};

SupportScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: "Contact Us",
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
            navigationData.navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.menuImage}
            source={require("../../../assets/assets/dashboard/ic_menu.png")}
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  supportView: {
    marginTop: 64,
    marginLeft: 64,
    marginRight: 64,
    marginBottom: 38,
    fontSize: RFPercentage(2),
    fontFamily: "SofiaPro-Medium",
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  supportText: {
    fontFamily: "SofiaPro-Medium",
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth - 64,
    borderRadius: 10,
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
  },
  totalAmountText: {
    margin: 16,
    fontFamily: "SofiaPro-SemiBold",
    fontSize: RFPercentage(2),
  },
  okayButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    width: 150,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: "SofiaPro-SemiBold",
    fontSize: RFPercentage(2),
  },
  contactDetailMainView: {
    marginTop: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  orText: {
    textAlign: "center",
    fontSize: RFPercentage(3),
    color: Colors.titleTextColor,
    fontFamily: "SofiaPro-Regular",
  },
  contactTitleText: {
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontFamily: "SofiaPro-Regular",
  },
  contactValueTextContainer: {
    marginTop:8
  },
  contactValueText: {
    fontWeight: "bold",
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontFamily: "SofiaPro-Regular",
    textDecorationLine: "underline",
  },
});

export default SupportScreen;
