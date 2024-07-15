const Opportunities = require("../../models/Opportunities");

module.exports.ListOpportunitiesService = async () => {
    const opportunities = await Opportunities.find();
    return opportunities;
}