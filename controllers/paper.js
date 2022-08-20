const Paper = require('../models/Paper');

exports.addPaper = () => {
    console.log('added');
}
exports.getByNumber = async (req, res) => {
    const { number } = req.body;
    const papers = await Paper.find({ number });
    if (papers === null)
        res.sendStatus(404);
    res.json(papers);
}
