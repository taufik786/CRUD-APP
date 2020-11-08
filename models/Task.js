const { model , Schema} = require('mongoose')

const newTaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
})

module.exports = model('TaskCollections', newTaskSchema);