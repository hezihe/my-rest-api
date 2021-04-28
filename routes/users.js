const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate, validateCards } = require('../models/user');
const { Card } = require('../models/card');
const auth = require('../middleware/auth');
const router = express.Router();

const getCards = async (cardsArray) => {
    const cards = await Card.find({ bizNumber: { $in: cardsArray} });
    return cards;
};

router.get('/cards/num', auth, async (req, res) => {

    if (!req.user.cards) res.status(400).send('Missing numbers data');
    
    let data = {};
    data.cards = req.user.cards.split(",");

    const cards = await getCards(data.cards);
    res.send(cards);

});

router.patch('/cards', auth, async (req, res) => {

    let user = await User.findById(req.user._id);
    user.cards.push(req.body.cardNumber);
    user = await user.save();
    res.send(user);
});

router.patch("/cards/stay", auth, async (req, res) =>{
    let user = await User.findById(req.user._id);
    user.cards = [...req.body.arr];
    user = await user.save();
    res.send(user);

});

router.patch('/cards/favs', auth, async (req, res) => {
    let user = await User.updateOne(
    { $pull: { cards: req.body.favNum }});
    res.send(user);
});

router.get('/cards/my-favs', auth, async(req,res) => {
    let user = await User.findById(req.user._id);
    res.send(user.cards);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // check if the email already exist in the DB
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
    
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'biz', 'cards']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.email.toLowerCase();
    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
    
});

module.exports = router;