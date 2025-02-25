const Opportunities = require("../../models/Opportunities");

module.exports.ListOpportunitiesService = async (filters = {}) => {
    const query = { ...filters };

    console.log(query);

    const opportunities = await Opportunities.find(query);
    
    return opportunities;
}