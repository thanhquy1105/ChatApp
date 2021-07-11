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
};

export default ChatService;
