'use strict';

const Categories = require('../../../src/models/categories.js');

const supergoose = require('../../supergoose.js');
beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Categories Model', () => {
  it('can post() a new category', () => {
    let obj = {name: 'category1'};
    let categories = new Categories();

    return categories.post(obj)
      .then((record) => {
        Object.keys(obj).forEach((key) => {
          expect(record[key]).toEqual(obj[key]);
        });
      })
      .catch((e) => console.error('ERR', e));
  });

  it('can get() a category', () => {
    const categories = new Categories();
    let obj = { name: 'Test Category' };

    return categories.post(obj).then((record) => {
      return categories.get(record._id)
        .then((category) => {
          Object.keys(obj).forEach((key) => {
            expect(category[0][key]).toEqual(obj[key]);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });

  it('can put() a category', () => {
    const categories = new Categories();
    let obj = { name: 'Test Category' };
    let obj2 = { name: 'Updated Category' };

    return categories.post(obj).then((record) => {
      return categories.put(record._id, obj2)
        .then((category) => {
          Object.keys(obj2).forEach((key) => {
            expect(category[key]).toEqual(obj2[key]);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });

  it('can delete() a category', () => {
    const categories = new Categories();
    let obj = { name: 'Test Category' };

    return categories.post(obj).then((record) => {
      return categories.delete(record._id) // doesn't return a promise
        .then((category) => {
          // verify delete returns deleted category
          Object.keys(obj).forEach((key) => {
            expect(category[0][key]).toEqual(obj[key]);
          });

          return categories.get().then(allCat => {
            expect(allCat.length).toEqual(1);
            expect(allCat[0]._id).not.toEqual(record._id);
          });
        })
        .catch((e) => console.error('ERR', e));
    });
  });
});
