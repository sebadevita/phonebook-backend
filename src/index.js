const http = require("http")
const express = require("express")
const app = express()

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

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(persons))
// })

app.get("/", (_request, response) => {
  response.send("<h1> Welcome to phonebook API</h1>")
})

app.get("/info", (_request, response) => {
  response.send(
    "<p> Phonebook has info " + persons.length + " for people </p>" + new Date()
  )
})

app.get("/api/persons", (_request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  try {
    const idPerson = request.params.id
    const person = persons.find((person) => person.id === Number(idPerson))
    if (!person) {
      throw Error("The id does not exists")
    }

    response.status(200).json(person)
  } catch (error) {
    console.log(error)
    response.status(404).json({ message: error.message})
  }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
