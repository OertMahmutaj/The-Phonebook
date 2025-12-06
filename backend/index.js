const express = require('express')
const Person = require('./models/person')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()
const app = express()
app.use(express.json())

// Logger middleware
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)


// Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

console.log(Person)

// Get one person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Generate new ID
// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
//   return String(maxId + 1)
// }

// Add new person
app.post('/api/persons', (request, response, next) => {
  console.log('Received body:', request.body) // << here!
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})


// Delete person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Updating person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  console.log(request)

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// Serve frontend (if built)
app.use(express.static('dist'))

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
