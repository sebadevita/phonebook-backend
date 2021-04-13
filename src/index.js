const http = require("http")
const express = require("express")
const app = express()
app.use(express.json())

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
  const idPerson = Number(request.params.id)
  const person = persons.find(person => person.id === idPerson)
  
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const idPerson = Number(request.params.id)
  persons = persons.filter(person => person.id !== idPerson)
  
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  
  console.log(request.body)
  const person = request.body
  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  if(!person.name || !person.number){
    return response.status(400).json({
      error: 'name is missing'
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


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
