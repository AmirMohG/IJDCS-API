
const mongoose = require("mongoose");



const PaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [{ type: Object, required: true }],
    index: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dor: {
        type: String
    },
    xml: {
        type: String
    },
    references: {
        type: String
    },
    keywords: [{ type: String, required: true }],
    corresponding: { type: String, required: true }
});




const Paper = mongoose.model("Paper", PaperSchema);

module.exports = Paper;
