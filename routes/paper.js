const express = require("express");
const router = express.Router();

const {
    addPaper,
    getByNumber
} = require("../controllers/paper");



router.route("/add").post(addPaper);
router.route("/getByNumber").post(getByNumber);

module.exports = router;
