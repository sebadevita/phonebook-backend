const errorHandler = (error, request, response, next) => {
    console.log(error.message)
  
    if (error.name === 'CastError'){
      return response.status(400).send({error: "malformatted id"})
    } 
    
    if (error.name === 'ValidationError') {
      return response.status(400).json({error: "validation error"})

    }
  
    next(error)
  }

  module.exports = errorHandler
