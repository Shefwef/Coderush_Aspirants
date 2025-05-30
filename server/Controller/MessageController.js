const Message = require("../Model/Message");
const getMessagesForChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort("createdAt");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    console.log("Received message data:", req.body);
    const { chatId, senderId, content, location } = req.body;

    const messageContent =
      content || (location ? "Shared a meetup location" : "");
    console.log("Received message body:", req.body);
    console.log("Content:", content);
    console.log("Location:", location);

    const message = new Message({
      chatId,
      senderId,
      content: messageContent,
      location,
    });

    await message.save();
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const recipientId =
      chat.adopterId.toString() === senderId.toString()
        ? chat.adopteeId
        : chat.adopterId;

    // Create a notification for the recipient
    await Notification.create({
      userId: recipientId,
      message: `New message from ${senderId}`,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error); // log full error
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = { getMessagesForChat, sendMessage };
