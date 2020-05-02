const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
// const rjwt = require('restify-jwt-community');

const server = restify.createServer();

// middleware, kalo di express = app.use
server.use(restify.plugins.bodyParser());

// protect routes dgn token kecuali /auth routes
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));

server.listen(config.PORT, () => {
  // hilangin deprecated warning findOneAndUpdate
  mongoose.set('useFindAndModify', false);

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
  require('./routes/customers')(server);
  require('./routes/users')(server);
  console.log(`Server berjalan di port ${config.PORT}`);
});
