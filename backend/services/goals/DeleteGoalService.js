const Meta = require("../../models/Goals");

module.exports.DeleteGoalService = async (id) => {
  const deleteMeta = await Meta.findByIdAndDelete(id);
  return deleteMeta;
}