import React from "react";
import Message from "../Message/Message";
import { useSelector } from "react-redux";

import "./MessageBox.scss";

const MessageBox = ({ chat }) => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <div id="msg-box">
      {chat.Messages.map((message, index) => {
        return (
          <Message
            user={user}
            chat={chat}
            message={message}
            index={index}
            key={message.id}
          />
        );
      })}
    </div>
  );
};

export default MessageBox;
