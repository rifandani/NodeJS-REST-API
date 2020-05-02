const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const config = require('../config');
const Customer = require('../models/Customer');

module.exports = (server) => {
  // get all Customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // get one Customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `Tidak ada customer dengan id ${req.params.id}`,
        ),
      );
    }
  });

  // add customers
  server.post(
    '/customers',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // check for json
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError(
            'Harusnya request bertipe application/json',
          ),
        );
      }

      const { name, email, balance } = req.body;
      const customer = new Customer({
        name: name,
        email: email,
        balance: balance,
      });

      try {
        const newCustomer = await customer.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    },
  );

  // update customers
  server.put(
    '/customers/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // check for json
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError(
            'Harusnya request bertipe application/json',
          ),
        );
      }

      try {
        const customer = await Customer.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          req.body, // yg mau di update
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `Tidak ada customer dengan id ${req.params.id}`,
          ),
        );
      }
    },
  );

  // delete customer
  server.del(
    '/customers/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const customer = await Customer.findOneAndRemove({
          _id: req.params.id,
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `Tidak ada customer dengan id ${req.params.id}`,
          ),
        );
      }
    },
  );
};
