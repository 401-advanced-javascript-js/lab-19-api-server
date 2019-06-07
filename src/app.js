'use strict';

// Queue Server
const QClient = require('@nmq/q/client');

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );

// Models
const Products = require('./models/products.js');
const Categories = require('./models/categories.js');

const products = new Products();
const categories = new Categories();

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.get('/categories', getCategories);
app.post('/categories', postCategories);
app.get('/categories/:id', getCategory);
app.put('/categories/:id', putCategories);
app.delete('/categories/:id', deleteCategories);

app.get('/products', getProducts);
app.post('/products', postProducts);
app.get('/products/:id', getProduct);
app.put('/products/:id', putProducts);
app.delete('/products/:id', deleteProducts);

// Catchalls
app.use(notFound);
app.use(errorHandler);

// ROUTE HANDLER FUNCTIONS
// ----------------------------------------------------------------------------------

function getCategories(request,response,next) {
  // expects an array of object to be returned from the model
  categories.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
      return output;
    })
    .then((data) => {
      QClient.publish('database', 'read', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: 'Error with getting categories.',
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function getCategory(request,response,next) {
  // expects an array with the one matching record from the model
  categories.get(request.params.id)
    .then( result => {
      response.status(200).json(result[0]);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'read', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error with getting category with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function postCategories(request,response,next) {
  // expects the record that was just added to the database
  categories.post(request.body)
    .then( result => {
      response.status(200).json(result[0]);
      return result;
    })
    .then( data => {
      QClient.publish('database', 'create', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: 'Error adding category.',
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function putCategories(request,response,next) {
  // expects the record that was just updated in the database
  categories.put(request.params.id, request.body)
    .then( result => {
      response.status(200).json(result[0]);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'update', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error updating category with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function deleteCategories(request,response,next) {
  // Expects no return value (resource was deleted)
  categories.delete(request.params.id)
    .then( result => {
      response.status(200).json(result);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'delete', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error deleting category with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

// ----------------------------------------------------------------------------------

function getProducts(request,response,next) {
  // expects an array of objects back
  products.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
      return output;
    })
    .then(data => {
      QClient.publish('database', 'read', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: 'Error with getting products.',
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function getProduct(request,response,next) {
  // expects an array with one object in it
  products.get(request.params.id)
    .then( result => {
      response.status(200).json(result[0])
    })
    .then(data => {
      QClient.publish('database', 'read', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error with getting product with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function postProducts(request,response,next) {
  // expects the record that was just added to the database
  products.post(request.body)
    .then( result => {
      response.status(200).json(result);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'create', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: 'Error adding product.',
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function putProducts(request,response,next) {
  // expects the record that was just updated in the database
  products.put(request.params.id, request.body)
    .then( result => {
      response.status(200).json(result);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'update', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error updating product with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}

function deleteProducts(request,response,next) {
  // Expects no return value (the resource should be gone)
  products.delete(request.params.id)
    .then( result => {
      response.status(200).json(result);
      return result;
    })
    .then(data => {
      QClient.publish('database', 'delete', data);
    })
    .catch( (error) => {
      let output = {
        friendlyMsg: `Error deleting product with id: ${request.params.id}`,
        errorMsg: error,
      };
      QClient.publish('database', 'error', output);
      next();
    });
}



module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`) ),
};
