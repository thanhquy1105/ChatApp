import React, { Fragment, useState } from "react";
import { userStatus } from "../../../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import Modal from "../../../Modal/Modal";
import ChatService from "../../../../services/chatService";

import "./ChatHeader.scss";

const ChatHeader = ({ chat }) => {
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
  const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const socket = useSelector((state) => state.chatReducer.socket);

  const searchFriends = (e) => {
    // chat service
    ChatService.searchUsers(e.target.value).then((res) => {
      setSuggestions(res);
    });
  };

  const addNewFriend = (id) => {
    // dispatch
    ChatService.addFriendToGroupChat(id, chat.id)
      .then((data) => {
        // emit
        socket.emit("add-user-to-group", data);
        setShowAddFriendModal(false);
        setShowChatOptions(false);
      })
      .catch((err) => console.log(err.response.data.message));
  };

  return (
    <Fragment>
      <div id="chatter">
        {chat.Users.map((user) => {
          return (
            <div className="chatter-info" key={user.id}>
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <div className="chatter-status">
                <span className={`online-status ${userStatus(user)} `}></span>
              </div>
            </div>
          );
        })}
      </div>
      <FontAwesomeIcon
        onClick={() => setShowChatOptions(!showChatOptions)}
        icon={["fas", "ellipsis-v"]}
        className="fa-icon"
      />

      {showChatOptions ? (
        <div id="settings">
          <div onClick={() => setShowAddFriendModal(true)}>
            <FontAwesomeIcon icon={["fas", "user-plus"]} className="fa-icon" />
            <p>Add user to chat</p>
          </div>

          {chat.type === "group" ? (
            <div>
              <FontAwesomeIcon
                icon={["fas", "sign-out-alt"]}
                className="fa-icon"
              />
              <p>Leave chat</p>
            </div>
          ) : null}

          <div>
            <FontAwesomeIcon icon={["fas", "trash"]} className="fa-icon" />
            <p>Delete chat</p>
          </div>
        </div>
      ) : null}

      {showAddFriendModal && (
        <Modal click={() => setShowAddFriendModal(false)}>
          <Fragment key="header">
            <h3 className="m-0">Add friend to group chat</h3>
          </Fragment>

          <Fragment key="body">
            <p>Find friends by typing their name bellow</p>
            <input
              onInput={(e) => searchFriends(e)}
              type="text"
              placeholder="Search..."
            />
            <div id="suggestions">
              {suggestions.map((user) => {
                return (
                  <div key={user.id} className="suggestion">
                    <p className="m-0">
                      {" "}
                      {user.firstName} {user.lastName}
                    </p>
                    <button onClick={() => addNewFriend(user.id)}>ADD</button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        </Modal>
      )}
    </Fragment>
  );
};

export default ChatHeader;
