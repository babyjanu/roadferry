import AppConstants from "./constants/AppConstants";

export default NotificationCall = (parameters) => {
    console.log(`NotificationCall parameters:`, parameters)
    fetch(AppConstants.SEND_NOTIFICATION, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(`SEND_NOTIFICATION: ${JSON.stringify(responseJson)}`);
        })
        .catch(error => {
          console.log(`SEND_NOTIFICATION.error: ${error}`);
        });
}