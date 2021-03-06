import {
  FETCH_CHATS,
  SET_CURRENT_CHAT,
  FRIENDS_ONLINE,
  FRIEND_OFFLINE,
  FRIEND_ONLINE,
  SET_SOCKET,
  RECEIVED_MESSAGE,
  SENDER_TYPING,
  PAGINATE_MESSAGES,
  INCREMENT_SCROLL,
  CREATE_CHAT,
  ADD_USER_TO_GROUP,
} from "../actions/chat";

const initialState = {
  chats: [],
  currentChat: {},
  socket: {},
  newMessage: { chatId: null, seen: null },
  scrollBottom: 0,
  senderTyping: { typing: false },
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CHATS: {
      var chatsCopy = payload;

      chatsCopy.sort(function (x, y) {
        let chat1 =
          x.Messages.length !== 0
            ? x.Messages[x.Messages.length - 1].createdAt
            : x.createdAt;
        let chat2 =
          y.Messages.length !== 0
            ? y.Messages[y.Messages.length - 1].createdAt
            : y.createdAt;

        return chat1 > chat2 ? -1 : 1;
      });

      return {
        ...state,
        chats: chatsCopy,
      };
    }
    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: null },
      };

    case FRIENDS_ONLINE: {
      const chatsCopy = state.chats.map((chat) => {
        return {
          ...chat,
          Users: chat.Users.map((user) => {
            if (payload.includes(user.id)) {
              return {
                ...user,
                status: "online",
              };
            }
            return user;
          }),
        };
      });

      return {
        ...state,
        chats: chatsCopy,
      };
    }

    case FRIEND_ONLINE: {
      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return {
              ...user,
              status: "online",
            };
          }

          return user;
        });

        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        return {
          ...chat,
          Users,
        };
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case FRIEND_OFFLINE: {
      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return {
              ...user,
              status: "offline",
            };
          }

          return user;
        });

        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        return {
          ...chat,
          Users,
        };
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      };

    case RECEIVED_MESSAGE: {
      const { userId, message } = payload;
      let currentChatCopy = { ...state.currentChat };
      let newMessage = { ...state.newMessage };
      let scrollBottom = state.scrollBottom;

      const chatsCopy = state.chats.map((chat) => {
        if (message.chatId === chat.id) {
          if (message.User.id === userId) {
            scrollBottom++;
          } else {
            newMessage = {
              chatId: chat.id,
              seen: false,
            };
          }

          if (message.chatId === currentChatCopy.id) {
            currentChatCopy = {
              ...currentChatCopy,
              Messages: [...currentChatCopy.Messages, ...[message]],
            };
          }
          return {
            ...chat,
            Messages: [...chat.Messages, ...[message]],
          };
        }

        return chat;
      });

      chatsCopy.sort(function (x, y) {
        return x.id === message.chatId ? -1 : y.id === message.chatId ? 1 : 0;
      });

      if (scrollBottom === state.scrollBottom) {
        return {
          ...state,
          chats: chatsCopy,
          currentChat: currentChatCopy,
          newMessage,
          senderTyping: { typing: false },
        };
      }

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
        newMessage,
        senderTyping: { typing: false },
        scrollBottom,
      };
    }

    case SENDER_TYPING: {
      if (payload.typing) {
        return {
          ...state,
          senderTyping: payload,
          scrollBottom: state.scrollBottom + 1,
        };
      }

      return {
        ...state,
        senderTyping: payload,
      };
    }

    case PAGINATE_MESSAGES: {
      const { messages, id, pagination } = payload;

      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        if (chat.id === id) {
          const shifted = [...messages, ...chat.Messages];

          currentChatCopy = {
            ...currentChatCopy,
            Messages: shifted,
            Pagination: pagination,
          };

          return {
            ...chat,
            Messages: shifted,
            Pagination: pagination,
          };
        }
        return chat;
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case INCREMENT_SCROLL:
      return {
        ...state,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: true },
      };

    case CREATE_CHAT:
      return {
        ...state,
        chats: [...[payload], ...state.chats],
      };

    case ADD_USER_TO_GROUP: {
      const { chat, chatters } = payload;

      let exists = false;

      const chatsCopy = state.chats.map((chatState) => {
        if (chat.id === chatState.id) {
          exists = true;

          return {
            ...chatState,
            Users: [...chatState.Users, ...chatters],
          };
        }

        return chatState;
      });

      if (!exists) chatsCopy.unshift(chat);
      else {
        chatsCopy.sort(function (x, y) {
          return x.id === chat.id ? -1 : y.id === chat.id ? 1 : 0;
        });
      }

      let currentChatCopy = {
        ...state.currentChat,
      };

      if (Object.keys(currentChatCopy).length > 0) {
        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...state.currentChat,
            Users: [...state.currentChat.Users, ...chatters],
          };
        }
      }

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }
    default: {
      return state;
    }
  }
};

export default chatReducer;
