
const mongoose = require("mongoose");

const connectDatabase = ( ) => {

    mongoose.connect("mongodb://0.0.0.0:27017/Ecommerce",{
        useNewUrlParser:true,
    }).then((maindata) => {
        console.log(`mongodb connect with server: ${maindata.connection.host} `)
    }).catch((err) => {
        console.log(err)
    })

}

module.exports = connectDatabase