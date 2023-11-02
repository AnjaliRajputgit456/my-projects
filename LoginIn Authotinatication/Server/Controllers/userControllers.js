
import UserModel from "../index.js";

class UserController {

      static createDoc = async (req, res) => {
        try {
           const doc = new UserModel(req.body)
            const result = await doc.save()
            res.status(201).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"something went wrong"})
        }
      }

      static getAllDoc = async  (req, res) => {
        try {
            const result = await UserModel.find()
            res.send(result)
        }catch (error) {
            console.log(error)
            res.status(500).json({message:"something went wrong"})
        }
        
      }
      static getSingleDocById = async (req, res) => {
        try {
            const result = await UserModel.findById(req.params.id)
            res.send(result)
        }catch (error) {
            console.log(error)
            res.status(500).json({message:"something went wrong"})
        }
      }

      static updateDocById = (req, res) => {
        res.send("update Doc By Id")
      }



      static deleteDocById = (req, res) => {
        res.send("delete Doc By Id")
      }


}

export default UserController;