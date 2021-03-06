const router = require("express").Router();
const {
  index,
  create,
  messages,
  deleteChat,
  imageUpload,
  addUserToGroup,
} = require("../controllers/chatController");
const { validate } = require("../validators");
const { auth } = require("../middleware/auth");
const { chatFile } = require("../middleware/fileUpload");

router.get("/index", [auth], index);
router.get("/messages", [auth], messages);
router.post("/create", [auth], create);
router.post("/upload-image", [auth, chatFile], imageUpload);
router.post("/add-user-to-group", [auth], addUserToGroup);
router.delete("/:id", [auth], deleteChat);

module.exports = router;
