require('dotenv').config()

const errorHandler = require('./middlewares/errorHandler')
const unknownEndPoint = require('./middlewares/unknownEndPoint')

const Person = require('./models/person')

const http = require('http')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { update } = require('./models/person')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
)

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.get('/', (_request, response) => {
  response.send('<h1> Welcome to phonebook API</h1>')
})

app.get('/info', (_request, response) => {
  Person.count({}, function (error, result) {
    if (error) {
      console.log(error)
    } else {
      response.send(
        '<p> Phonebook has info ' + result + ' for people </p>' + new Date()
      )
    }
  })
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const idPerson = request.params.id
  Person.findById(idPerson).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).json({ error: 'could not find a person with the given id' })
    }
  })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const idPerson = request.params.id

  Person.findByIdAndRemove(idPerson)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  console.log(request.body)
  const newPerson = request.body

  if (!newPerson.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!newPerson.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save()
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = request.body
  const idPerson = request.params.id
  const person = {
    name: updatedPerson.name,
    number: updatedPerson.number
  }

  Person.findByIdAndUpdate(idPerson, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// const filter = { id: request.params.id }
// const update = { person }
// const doc = Person.findOneAndUpdate(
//   { filter },
//   { name: updatedPerson.name },
//   {
//      new: true
//   }
// ).then(
//   doc => {
//     console.log(doc)
//     response.json(doc)

//   })
//   .catch(error => next(error))

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
