require("dotenv").config()
const Person = require('./models/person')

const http = require("http")
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("build"))
app.use(morgan("tiny"))
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
)

morgan.token("body", (req, res) => JSON.stringify(req.body))


let persons = [
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    id: 1,
    name: "Arto Hellas",
    number: "12-34567-8",
  },
  {
    id: 99,
    name: "Adam Smith",
    number: "12-34567-8",
  },
]

app.get("/", (_request, response) => {
  response.send("<h1> Welcome to phonebook API</h1>")
})

app.get("/info", (_request, response) => {
  response.send(
    "<p> Phonebook has info " + persons.length + " for people </p>" + new Date()
  )
})

app.get("/api/persons", (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }) 
})

app.get("/api/persons/:id", (request, response) => {
  const idPerson = Number(request.params.id)
  const person = persons.find((person) => person.id === idPerson)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const idPerson = Number(request.params.id)
  persons = persons.filter((person) => person.id !== idPerson)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  console.log(request.body)
  const person = request.body
  const ids = persons.map((person) => person.id)
  const maxId = Math.max(...ids)

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "name is missing",
    })
  }

  if (personAlreadyExists(person.name)) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number,
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const personAlreadyExists = (name) => {
  return persons.some((person) => person.name === name)
}

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
