const express = require('express')
const app = express()
app.use(express.json())

let persons = [
  { id: '1', name: 'Ciao', number: '12345' },
  { id: '2', name: 'Silvia', number: '67890' },
  { id: '3', name: 'Balasini ❤️', number: '54321' },
]

// Logger middleware
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)

// Serve frontend (if built)
app.use(express.static('dist'))

// Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Get one person
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// Generate new ID
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
  return String(maxId + 1)
}

// Add new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  res.json(person)
})

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id)
  res.status(204).end()
})

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
