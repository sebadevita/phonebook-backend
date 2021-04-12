const http = require('http')
const express = require('express')
const app = express()


 let persons = [
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "id": 1,
        "name": "Arto Hellas",
        "number": "12-34567-8"
      },
      {
        "id": 99,
        "name": "Adam Smith",
        "number": "12-34567-8"
      }
    ]


// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(persons))
// })

app.get('/', (request, response) => {
    response.send('<h1> Welcome to phonebook API</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)