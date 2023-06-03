const { search: searchAmazon } = require("../services/amazonScraperService");
const { search: searchCroma } = require("../services/cromaScraperService");

exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    const amazonProducts = await searchAmazon(keyword);
    // const flipkartProducts = await searchFlipkart(keyword);
    const cromaProducts = await searchCroma(keyword);
    res.json({ amazon: amazonProducts, croma: cromaProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
