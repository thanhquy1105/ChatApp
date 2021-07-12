import React, { useEffect, useRef, useState } from "react";
import Message from "../Message/Message";
import { useSelector, useDispatch } from "react-redux";
import { paginateMessages } from "../../../../store/actions/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MessageBox.scss";

const MessageBox = ({ chat }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [scrollUp, setScrollUp] = useState(0);

  const user = useSelector((state) => state.authReducer.user);

  const scrollBottom = useSelector((state) => state.chatReducer.scrollBottom);
  const senderTyping = useSelector((state) => state.chatReducer.senderTyping);

  const msgBox = useRef();

  const handleInfiniteScroll = (e) => {
    if (e.target.scrollTop === 0) {
      setLoading(true);

      const pagination = chat.Pagination;
      const page = typeof pagination === "undefined" ? 1 : pagination.page;

      if (
        pagination &&
        parseInt(pagination.page) + 1 === pagination.totalPages
      ) {
        setLoading(false);
      } else {
        dispatch(paginateMessages(chat.id, parseInt(page) + 1))
          .then((res) => {
            if (res) {
              setScrollUp(scrollUp + 1);
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  };

  const scrollManual = (value) => {
    msgBox.current.scrollTop = value;
  };

  useEffect(() => {
    setTimeout(() => {
      scrollManual(Math.ceil(msgBox.current.scrollHeight * 0.1));
    }, 100);
  }, [scrollUp]);

  useEffect(() => {
    if (
      senderTyping.typing &&
      msgBox.current.scrollTop > msgBox.current.scrollHeight * 0.6
    ) {
      setTimeout(() => {
        scrollManual(Math.ceil(msgBox.current.scrollHeight));
      }, 100);
    }
  }, [senderTyping]);

  useEffect(() => {
    if (!senderTyping.typing) {
      setTimeout(() => {
        scrollManual(Math.ceil(msgBox.current.scrollHeight));
      }, 100);
    }
  }, [scrollBottom]);

  return (
    <div onScroll={handleInfiniteScroll} id="msg-box" ref={msgBox}>
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : null}

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

      {senderTyping.typing && senderTyping.chatId === chat.id ? (
        <div className="message mt-5p">
          <div className="other-person">
            <p className="m-0">
              {senderTyping.fromUser.firstName} {senderTyping.fromUser.lastName}
              ...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MessageBox;
