
function createAutoIncrementIdPreHook(schema) {
    return async function(next) {
      const highestIdDoc = await this.constructor.findOne({}, '_id').sort({ _id: -1 }).exec();
      this._id = highestIdDoc ? highestIdDoc._id + 1 : 1;
      next();
    };
  }
  
  module.exports = createAutoIncrementIdPreHook;
  