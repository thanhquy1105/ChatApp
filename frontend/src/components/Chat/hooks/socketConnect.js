import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import {
  fetchChats,
  offlineFriend,
  onlineFriend,
  onlineFriends,
  receivedMessage,
  senderTyping,
  setSocket,
  createChat,
} from "../../../store/actions/chat";

function useSocket(user, dispatch) {
  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => {
        const socket = socketIOClient.connect();

        dispatch(setSocket(socket));

        socket.emit("join", user);

        socket.on("typing", (sender) => {
          dispatch(senderTyping(sender));
        });

        socket.on("friends", (friends) => {
          dispatch(onlineFriends(friends));
        });

        socket.on("online", (friend) => {
          dispatch(onlineFriend(friend));
        });

        socket.on("offline", (friend) => {
          dispatch(offlineFriend(friend));
        });

        socket.on("received", (message) => {
          dispatch(receivedMessage(message, user.id));
        });

        socket.on("new-chat", (chat) => {
          dispatch(createChat(chat));
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
}

export default useSocket;
