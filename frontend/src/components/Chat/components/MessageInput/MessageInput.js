import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import ChatService from "../../../../services/chatService";
import { Picker } from "emoji-mart";
import { incrementScroll } from "../../../../store/actions/chat";

import "emoji-mart/css/emoji-mart.css";
import "./MessageInput.scss";

var startPosition;
var emojiLength = 0;

const MessageInput = ({ chat }) => {
  const dispatch = useDispatch();
  const fileUpload = useRef();
  const msgInput = useRef();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [justClickEmoji, setJustClickEmoji] = useState(false);
  const [showNewMessageNotification, setShowNewMessageNotification] =
    useState(false);

  const user = useSelector((state) => state.authReducer.user);
  const socket = useSelector((state) => state.chatReducer.socket);
  const newMessage = useSelector((state) => state.chatReducer.newMessage);

  const handleMessage = (e) => {
    const value = e.target.value;
    setMessage(value);

    const receiver = {
      chatId: chat.id,
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
    };

    // notify other users that this user is/isn't typing something
    if (value.length === 1) {
      receiver.typing = true;
      socket.emit("typing", receiver);
    }

    if (value.length === 0) {
      receiver.typing = false;
      socket.emit("typing", receiver);
    }
  };

  const handleKeyDown = (e, imageUpload) => {
    if (e.key === "Enter") sendMessage(imageUpload);
  };

  const sendMessage = (imageUpload) => {
    if (message.length < 1 && !imageUpload) return;

    const msg = {
      type: imageUpload ? "image" : "text",
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
      chatId: chat.id,
      message: imageUpload ? imageUpload : message,
    };

    setMessage("");
    setImage("");
    setShowEmojiPicker(false);
    setShowNewMessageNotification(false);
    // send message with socket
    socket.emit("message", msg);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("id", chat.id);
    formData.append("image", image);

    // chat service
    ChatService.uploadImage(formData)
      .then((image) => {
        sendMessage(image);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (justClickEmoji) {
      msgInput.current.selectionStart = msgInput.current.selectionEnd =
        startPosition + emojiLength;
      setJustClickEmoji(false);
    }
  }, [justClickEmoji]);

  const selectEmoji = (emoji) => {
    startPosition = msgInput.current.selectionStart;
    const endPosition = msgInput.current.selectionEnd;

    emojiLength = emoji.native.length;

    const value = msgInput.current.value;

    setJustClickEmoji(true);

    msgInput.current.focus();

    setMessage(
      value.substring(0, startPosition) +
        emoji.native +
        value.substring(endPosition, value.length)
    );
  };

  useEffect(() => {
    const msgBox = document.getElementById("msg-box");

    if (
      !newMessage.seen &&
      newMessage.chatId === chat.id &&
      msgBox.scrollHeight !== msgBox.clientHeight
    ) {
      if (msgBox.scrollTop > msgBox.scrollHeight * 0.3) {
        console.log(123);
        dispatch(incrementScroll());
      } else {
        setShowNewMessageNotification(true);
      }
    } else {
      setShowNewMessageNotification(false);
    }
  }, [newMessage, dispatch]);

  const showNewMessage = () => {
    dispatch(incrementScroll());
    setShowNewMessageNotification(false);
  };

  return (
    <div id="input-container">
      <div id="image-upload-container">
        <div>
          {showNewMessageNotification ? (
            <div id="message-notification" onClick={showNewMessage}>
              <FontAwesomeIcon icon="bell" className="fa-icon" />
              <p className="m-0">New message</p>
            </div>
          ) : null}
        </div>

        <div id="image-upload">
          {image && image.name ? (
            <div id="image-details">
              <p className="m-0">{image.name}</p>
              <FontAwesomeIcon
                onClick={handleImageUpload}
                icon="upload"
                className="fa-icon"
              />
              <FontAwesomeIcon
                onClick={(e) => setImage("")}
                icon="times"
                className="fa-icon"
              />
            </div>
          ) : null}
          <FontAwesomeIcon
            onClick={() => fileUpload.current.click()}
            icon={["far", "image"]}
            className="fa-icon"
          />
        </div>
      </div>
      <div id="message-input">
        <input
          type="text"
          placeholder="Message..."
          ref={msgInput}
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />

        <FontAwesomeIcon
          onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
          icon={["far", "smile"]}
          className="fa-icon"
        />
      </div>
      <input
        id="chat-image"
        ref={fileUpload}
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {showEmojiPicker ? (
        <Picker
          title="Pick your emoji..."
          emoji="point_up"
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
          onSelect={selectEmoji}
        />
      ) : null}
    </div>
  );
};

export default MessageInput;
