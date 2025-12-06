require('dotenv').config()   // Load environment variables from .env
const mongoose = require('mongoose')

const password = process.env.MONGO_PASSWORD

if (!password) {
  console.error('Error: MONGO_PASSWORD not set in .env')
  process.exit(1)
}

const url = `mongodb+srv://oert64:${password}@maincluster.2b6kbwx.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    const person = new Person({
      name: 'Ciao', 
      number: '12345'
    })

    return person.save()
  })
  .then(savedPerson => {
    console.log('Person saved:', savedPerson)
  })
  .catch(err => {
    console.error('Error:', err.message)
  })
  .finally(() => {
    mongoose.connection.close()
  })
