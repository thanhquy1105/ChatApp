import API from "./api";

const ChatService = {
  fetchChats: async () => {
    return await API.get("/chats/index")
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("chat Service err", err);

        throw err;
      });
  },

  uploadImage: async (data) => {
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    return await API.post("/chats/upload-image", data, headers)
      .then(({ data }) => {
        return data.url;
      })
      .catch((err) => {
        console.log("chat Service err", err);

        throw err;
      });
  },

  paginateMessages: async (id, page) => {
    return await API.get("/chats/messages", {
      params: {
        id,
        page,
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Chat pagination err", err);

        throw err;
      });
  },

  searchUsers: async (term) => {
    return await API.get("/users/search-users", {
      params: {
        term,
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("users search err", err);

        throw err;
      });
  },

  createChat: async (partnerId) => {
    return await API.post("/chats/create", { partnerId })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("create chat err", err);

        throw err;
      });
  },

  addFriendToGroupChat: async (userId, chatId) => {
    return await API.post("/chats/add-user-to-group", { userId, chatId })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("create chat err", err);

        throw err;
      });
  },
};

export default ChatService;
