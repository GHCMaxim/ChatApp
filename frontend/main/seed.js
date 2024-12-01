// seed.js
const mongoose = require("mongoose");
const User = require("./models/User"); // đường dẫn đến mô hình User của bạn
const Chat = require("./models/Chat"); // đường dẫn đến mô hình Chat của bạn

// Kết nối tới MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Dữ liệu người dùng mẫu
const users = [
  { username: "user1", email: "user1@example.com", password: "123456" },
  { username: "user2", email: "user2@example.com", password: "123456" }
];

// Dữ liệu hội thoại mẫu
const chats = [
  {
    participants: ["user1", "user2"],
    messages: [
      { sender: "user1", content: "Hello user2!" },
      { sender: "user2", content: "Hi user1!" }
    ]
  }
];

const seedData = async () => {
  await User.insertMany(users);
  await Chat.insertMany(chats);
  console.log("Seed data inserted");
  mongoose.connection.close();
};

seedData().catch(err => console.error(err));
