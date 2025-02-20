const MetaCustomerSuccess = require("../../models/CustomerSuccessGoals");

module.exports.DeleteCustomerSuccessGoalService = async (id) => {
  const deleteCustomerSuccessMeta = await MetaCustomerSuccess.findByIdAndDelete(id);
  return deleteCustomerSuccessMeta;
}