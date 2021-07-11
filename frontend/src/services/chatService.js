import API from "./api";

const ChatService = {
  fetchChats: () => {
    return API.get("/chats/index")
      .then(({ data }) => {
        console.log("chat Service", data);
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

export default ChatService;
