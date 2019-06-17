'use strict';

// version 4 uses random id
// uuid() will return djflkajfoihoioi23h423r9u
const uuid = require('uuid/v4');

const schema = require('./categories-schema.js');

// Categories data model
class Categories {

  constructor() {
  }

  /**
   * Get category of passed id
   * 
   * @param {Number} _id
   * @returns {Promise|null} promise that resolves to category of passed in id, null if category with id doesn't exist
   */
  get(_id) {
    // if no id passed, return all categories
    // if (!_id) return Promise.resolve(this.database);
    let queryObject = _id ? {_id} : {};
    return schema.find(queryObject);
  }
  
  /**
   * Add category to database
   * 
   * @param {Object} entry, contains category data
   * @returns {Promise}
   */
  post(entry) {
    entry._id = uuid(); // id for entry, random hash
    let record = new schema(entry);
    return record.save();
  }

  /**
   * Update data for category with passed id
   * 
   * @param {Number} _id
   * @param {Object} entry
   * @returns {Promise}
   */
  put(_id, entry) {
    let record = new schema(entry);
    return schema.findByIdAndUpdate(_id, record, {new: true});
  }

  /**
   * Delete category with passed id
   * @param {Number} _id
   * @returns {Promise}
   */
  delete(_id) {
    let queryObject = _id ? {_id} : {};
    return schema.findByIdAndRemove(queryObject);
  }

  // sanitize(entry) {
  //   let valid = true;
  //   let record = {};

  //   Object.keys(schema).forEach(field => {
  //     // mongo talks about "columns" as fields
  //     // property === field
  //     if (schema[field].required) {
  //       // null and 0 are valid
  //       if (entry[field] !== undefined) {
  //         record[field] = entry[field];
  //       } else {
  //         valid = false;
  //       }
  //     } else {
  //       record[field] = entry[field];
  //     }
  //   });
  //   return valid ? record : null;
  // }

}

module.exports = Categories;
