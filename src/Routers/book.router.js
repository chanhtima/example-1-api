const express = require("express");
const { getList } = require("../Controllers/book.controllers");
const route = express.Router();

route.get("/book", getList);

module.exports = route;
