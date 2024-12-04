import Cookies from "universal-cookie";
import { SOCKET_URL } from "./const";
import { io } from "socket.io-client";
const cookies = new Cookies();

class WebSocketClient {
  constructor(url, token) {
    if (!WebSocketClient.instance) {
      this.socket = new io(url)
      WebSocketClient.instance = this;
    }

    return WebSocketClient.instance;
  }

  emit(action, payload, fn) {
    if (this.socket)
        this.socket.emit(action, payload, fn)
    };

  listen(action, fn) {
    if (this.socket)
        this.socket.on(action, fn)
    };

}

const token = cookies.get('token');
const instance = new WebSocketClient(SOCKET_URL, token);
Object.freeze(instance);

export default instance;