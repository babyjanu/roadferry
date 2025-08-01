import AppConstants from "../helper/constants/AppConstants";

class WebSocketService {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.listeners = {};
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            this.notifyListeners(data);
        };

        this.socket.onclose = () => {
            // console.log('WebSocket disconnected');
            this.connect();
        };

        this.socket.onerror = (error) => {
            // console.error('WebSocket error', error);
        };
    }

    notifyListeners(data) {
        const { event } = data;
        if (!event) {
            console.warn('Received message without event:', data);
            return; // Exit if type is missing
        }
        // console.log('inside notifyListeners: ', data, event);
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    getListeners() {
        return this.listeners;
    }

    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    unsubscribe(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
const url = AppConstants.webSocketUrl; // use this when it's live
const serverPort = 'ws://15.207.123.210:3000';
const localhost = 'ws://localhost:3000/'
export default new WebSocketService(url);