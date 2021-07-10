import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import {
  fetchChats,
  offlineFriend,
  onlineFriend,
  onlineFriends,
  receivedMessage,
  setSocket,
} from "../../../store/actions/chat";

function useSocket(user, dispatch) {
  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => {
        const socket = socketIOClient.connect("http://127.0.0.1:3000");

        dispatch(setSocket(socket));

        socket.emit("join", user);

        socket.on("typing", (user) => {
          console.log("typing", user);
        });

        socket.on("friends", (friends) => {
          console.log("friends", friends);
          dispatch(onlineFriends(friends));
        });

        socket.on("online", (friend) => {
          console.log("online", friend);
          dispatch(onlineFriend(friend));
        });

        socket.on("offline", (friend) => {
          console.log("offline", friend);
          dispatch(offlineFriend(friend));
        });

        socket.on("received", (message) => {
          console.log("received", message);
          dispatch(receivedMessage(message, user.id));
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
}

export default useSocket;
