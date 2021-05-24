const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

app.get('/', (req, res) => {
  res.send('Hello Manager !')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('no err', err)
  const employessCollection = client.db("dashboard").collection("employees");
  console.log('database connected successfully')

  // add Employee
  app.post('/createEmployee', (req, res) => {
    // console.log(req)
    const data = req.body;
    console.log('add new ser', data)
    employessCollection.insertOne(data)
      .then(result => {
        console.log('inserted conunt', result)
        res.send(result.insertedCount > 0)
      })
  })

  // find all employee
  app.get('/employees', (req, res) => {
    employessCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  // delete employee
  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)
    employessCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })
  //single employee data load
  app.get('/employee/:id', (req, res) => {
    employessCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  // update data
  app.patch('/updateEmployee/:id', (req, res) => {
    console.log(req)
    employessCollection.updateOne({ _id: ObjectId(req.params.id)},
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          BOD: req.body.BOD,
          employeeCode: req.body.employeeCode,
        }
      })
      .then(result => {
        res.json(result)
        console.log(result);
    })
  })


});


const port = process.env.PORT || 5000
app.listen(port);