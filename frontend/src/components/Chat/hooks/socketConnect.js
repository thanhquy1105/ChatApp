import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { onlineFriends } from "../../../store/actions/chat";

function useSocket(user, dispatch) {
  useEffect(() => {
    const socket = socketIOClient.connect("http://127.0.0.1:3000");

    socket.emit("join", user);

    socket.on("typing", (user) => {
      console.log("typing", user);
    });

    socket.on("friends", (friends) => {
      console.log("friends", friends);
      dispatch(onlineFriends(friends));
    });

    socket.on("online", (user) => {
      console.log("online", user);
    });

    socket.on("offline", (user) => {
      console.log("offline", user);
    });
  }, [dispatch]);
}

export default useSocket;
