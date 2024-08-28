const { getList } = require("../Models/book.model");

exports.getList = async (req, res) => {
  try {
    const { page = 1, limit = 100, NE_name } = req.query;

    const result = await getList(page, limit, NE_name);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: "Failed to get Books",
      error: error.message,
    });
  }
};
