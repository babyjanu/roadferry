import socketIo from "./socketIOServices";
import webSocketServices from "./webSocketServices";

export const registerCustomer_ws = (userId) => {
    let obj = {
        "event": "registerCustomer",
        "data": {
          "customerId": userId
        }
    }
    // console.log('registerCustomer_ws: ', obj);
    // webSocketServices.send(obj);
    socketIo.sendEvent('registerCustomer', obj);
};