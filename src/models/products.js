'use strict';


// version 4 uses random id
// uuid() will return djflkajfoihoioi23h423r9u
const uuid = require('uuid/v4');
const schema = require('./products-schema.js');

// const schema = {
//   _id: {required: true},
//   name: {required: true}
// };

class Products {

  constructor() {
    // this.database = [];
  }

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return schema.find(queryObject);
  }
  
  post(entry) {
    entry._id = uuid();
    let record = new schema(entry);
    // TODO: pre-save
    return record.save();
  }

  put(_id, entry) {
    let record = new schema(entry);
    return schema.findByIdAndUpdate(_id, record, {new: true});
  }

  delete(_id) {
    return schema.findByIdAndDelete(_id);
  }

  // sanitize(entry) {
  // }

}

module.exports = Products;