   const http = require("http");
   const dotenv =require("dotenv")
  const express = require("express");
  const bodyParser = require('body-parser');
  const connectDatabase = require("./database")
  const user = require("./routes/userRoute");
  const product = require("./routes/productRoute");
  const cookieParser = require("cookie-parser");
  const order = require("./routes/orderRoute");




    dotenv.config()
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  
   connectDatabase()


   // Use body-parser middleware to parse request bodies
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

   app.use("/data2", order);
   app.use("/data1",user);
   app.use("/data",product);
   



const port = 8001;
const server = http.createServer(app);

console.log("process.env.JWT_EXPIRE.",process.env.JWT_EXPIRE)

  server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
  });