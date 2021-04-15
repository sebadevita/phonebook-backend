require('dotenv').config()
const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGO_DB_URI
  

mongoose.connect(
    url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Seba Mongo',
  number: '123-456'
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})