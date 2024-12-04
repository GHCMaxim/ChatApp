import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userActions } from "../store/userSlice";
import websocketClient from "../utils/WebSocketClient";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const useInit = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userReducer.user.id);

  if (!userId && cookies.get("user")) {
    dispatch(userActions.setUser(cookies.get("user")));
  }

  const loggedIn = useSelector((state) => state.authReducer.loggedIn);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    console.log("Connecting to socket");
    if (websocketClient.socket.disconnected) {
      websocketClient.socket.connect();
    }

    websocketClient.emit("user:online", userId);

    return () => {
      if (websocketClient.socket) {
        websocketClient.socket.disconnect();
      }
    };
  }, [loggedIn]);

  return {
    loggedIn
  }
}

export default useInit;