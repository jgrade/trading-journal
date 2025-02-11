const express = require('express');
const router = express.Router();
const tradeManager = require('../utils/tradeManager');
const moment = require('moment');

router.get('/new', (req, res) => {
    res.render('entry-form', { trade: null });
});

router.post('/', async (req, res) => {
    try {
        const tradeData = {
            currencyPair: req.body.currencyPair.toUpperCase(),
            tradeType: req.body.tradeType,
            trend: req.body.trend,
            openTime: moment(req.body.openTime).toISOString(),
            closeTime: moment(req.body.closeTime).toISOString(),
            outcome: req.body.outcome,
            potentialOutcome: req.body.outcome === 'BE' ? req.body.potentialOutcome : null,
            setupUrl: req.body.setupUrl,
            notes: req.body.notes
        };

        await tradeManager.addTrade(tradeData);
        res.redirect('/');
    } catch (error) {
        res.status(400).render('entry-form', { error: error.message });
    }
});

router.get('/:id/edit', async (req, res) => {
    const trades = await tradeManager.getAllTrades();
    const trade = trades.find(t => t.id === req.params.id);
    res.render('entry-form', { trade });
});

router.post('/:id', async (req, res) => {
    try {
        await tradeManager.updateTrade(req.params.id, req.body);
        res.redirect('/');
    } catch (error) {
        res.status(400).render('entry-form', { error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await tradeManager.deleteTrade(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 