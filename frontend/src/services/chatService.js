import API from "./api";

const ChatService = {
  fetchChats: async () => {
    console.log("Chat.js chatactions fetchChats");
    return await API.get("/chats/index")
      .then(({ data }) => {
        console.log("chat Service data", data);
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
        console.log("chat upload image ", data);
        return data.url;
      })
      .catch((err) => {
        console.log("chat Service err", err);

        throw err;
      });
  },
};

export default ChatService;
