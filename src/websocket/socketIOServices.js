import io from 'socket.io-client';
import AppConstants from '../helper/constants/AppConstants';
import { Alert } from 'react-native';

class SocketIOService {
  constructor(url) {
    this.url = url;
    this.socket = null;
  }

  // Connecting to the Socket.IO server
  connect = () => {
    if (!this.socket) {
      this.socket = io(this.url);

      this.socket.on('connect', () => {
        console.log('Socket connected to server:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket io Connection Error:', JSON.stringify(error));
      });
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }
  };

  getSocket = () => this.socket;

  // Disconnect from the server
  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket io Disconnected from server');
    }
  };

  // Emiting event with data
  sendEvent = (event, data) => {
    // console.log('send event condition: ', (this.socket && this.socket.connected));
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
      // console.log(`Socket io, Sent event: ${event} with data:`, data);
    } /* else{
      Alert.alert('Something went wrong, please try again later.');
    } */
  };

  // Listening for events
  listenForEvent = (event, callback) => {
    if (this.socket) {
      this.socket.on(event, (data) => {
        console.log(`Socket io, Received event: ${event} with data:`, data);
        callback(data);
      });
    }
  };

  // Removing event listener
  removeListener = (event) => {
    if (this.socket) {
      this.socket.removeListener(event);
      console.log(`Socket io, Removed listener for event: ${event}`);
    }
  };

  // Emiting event and wait for a response (if required)
  emitWithResponse = (event, data, callback) => {
    if (this.socket) {
      this.socket.emit(event, data, (response) => {
        console.log(`Socket io, Received response for event: ${event}:`, response);
        callback(response);
      });
    }
  };

  // Checking if the socket is connected
  isConnected = () => {
    return this.socket && this.socket.connected;
  };
}

const url = AppConstants.socketIOUrl;
const socketIo = new SocketIOService(url);
export default socketIo;
