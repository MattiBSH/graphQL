import mongoose, { mongo } from 'mongoose'
import path from "path"
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const CONNECTION = process.env.CONNECTION
mongoose.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const friendSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  gender: {
    type: String
  },
  age: {
    type: Number
  },
  language: {
    type: String
  },
  email: {
    type: String
  },
  contacts: {
    type: Array
  }
});

const Friends = mongoose.model('friends', friendSchema);



export { Friends };
