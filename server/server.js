require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const petRouter = require("./Routes/PetRoute");
const AdoptFormRoute = require("./Routes/AdoptFormRoute");
const userRoute = require("./Routes/user.route");
const authRoute = require("./Routes/auth.route");
const AdminRoute = require("./Routes/AdminRoute");
const vetRouter = require("./Routes/VetRoute");
const wishlistRouter = require("./Routes/wishlist");
const listingRoutes = require("./Routes/listing.route");
const communicationRouter = require("./Routes/ChatRoutes");
const profilerouter = require("./Routes/profileroute.js");
const msgRouter = require("./Routes/MessageRoutes");
const trainRoute = require("./Routes/TrainRoute");
const notifyroutes = require("./Routes/notifyroutes");
const newsRoutes = require("./Routes/newsRoute.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const createError = require("./utils/createError");
const adminuserroutes = require("./Routes/adminuserroute");

const app = express();

app.use(morgan("combined"));

app.use(helmet());

const allowedOrigins = ["https://wnco.onrender.com", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(petRouter);
app.use("/listings", listingRoutes);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/api/vets", vetRouter);
app.use("/form", AdoptFormRoute);
app.use("/admin", AdminRoute);
app.use("/train", trainRoute);
app.use("/wishlist", wishlistRouter);
app.use("/profile", profilerouter);
app.use("/chats", communicationRouter);
app.use("/messages", msgRouter);
app.use("/api", newsRoutes);
app.use("/notifications", notifyroutes);
app.use("/adminuser", adminuserroutes);
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

app.all("*", (req, res, next) => {
  next(createError(404, `Cannot find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});
