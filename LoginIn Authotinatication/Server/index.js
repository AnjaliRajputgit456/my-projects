import http from "http";
import express from "express";
import mongoose from "mongoose";
import web from "./routes/web.js";
import cors from "cors"
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cors());

const port = 8001;

// connect db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://0.0.0.0:27017/__", {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

//JSON//
app.use(express.json())

//Load Routers//
app.use("/data", web);

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
});

userSchema.pre('save', function(next)  {
  if(this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 12);
  }
  next();
  })
  

const UserModel = mongoose.model("user", userSchema);





const SignUpHanlder =  async (id, name, email, password) => {
  
  try {

    const newUser = new UserModel({ id, name, email, password });

    await newUser.save();
     
    return {
      message: "Successfully Signed Up",
    };
  } catch (error) {
    throw error;
  }
};

const SignInHanlder = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw { message: "Invalid email" };
    }

    if (user.password !== password) {
      throw { message: "Invalid email or password" };
    }

    return {
      message: "SuccessFully Login",
      user,
    };
  } catch (error) {
    throw error;
  }
};
const server = http.createServer(app);


app.post("/signup", async (req, res) => {
  console.log("test")
  const { id, name, email, password } = req.body;
  try {
    const result = await SignUpHanlder(id, name, email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/signin", async (req, res) => {
  console.log('test')
  const { email, password } = req.body;
  try {
    const result = await SignInHanlder (email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});

export default UserModel;
