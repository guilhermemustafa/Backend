const mongoose = require('mongoose');
const uri = "mongodb+srv://mustafa:mustafa@cluster0.2suon.mongodb.net/mind?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,})
.then(function () {
    console.log('Conectou!')
  })
  .catch(function (err) {
    console.log(err)
  })
mongoose.Promise = global.Promise
module.exports = mongoose
