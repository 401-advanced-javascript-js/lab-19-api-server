'use strict';

const Products = require('../../../src/models/products.js');

const supergoose = require('../../supergoose.js');
beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Products Model', () => {
  it('can post() a new product', () => {
    let obj = {name: 'product1'};
    let products = new Products();

    return products.post(obj)
      .then((record) => {
        Object.keys(obj).forEach((key) => {
          expect(record[key]).toEqual(obj[key]);
        });
      })
      .catch((e) => console.error('ERR', e));
  });

  it('can get() a product', () => {
    const products = new Products();
    let obj = { name: 'Test Product' };

    return products.post(obj).then((record) => {
      return products.get(record._id)
        .then((product) => {
          Object.keys(obj).forEach((key) => {
            expect(product[0][key]).toEqual(obj[key]);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });

  it('can put() a product', () => {
    const products = new Products();
    let obj = { name: 'Test Product' };
    let obj2 = { name: 'Updated Product' };

    return products.post(obj).then((record) => {
      return products.put(record._id, obj2)
        .then((category) => {
          Object.keys(obj2).forEach((key) => {
            expect(category[0][key]).toEqual(obj2[key]);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });

  it('can delete() a product', () => {
    const products = new Products();
    let obj = { name: 'Test Product' };
    // let obj2 = { name: 'Updated Product' };

    return products.post(obj).then((record) => {
      return products.delete(record._id)
        .then((product) => {
          // verify delete returns deleted category
          Object.keys(record).forEach((key) => {
            expect(product[0][key]).toEqual(record[key]);
          });

          return products.get().then(allProducts => {
            expect(allProducts.length).toEqual(1);
            expect(allProducts[0]._id).not.toEqual(record._id);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });
});
