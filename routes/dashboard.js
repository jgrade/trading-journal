const express = require('express');
const router = express.Router();
const tradeManager = require('../utils/tradeManager');
const statistics = require('../utils/statistics');
const moment = require('moment');

router.get('/', async (req, res) => {
    try {
        const trades = await tradeManager.getAllTrades();
        const includeBreakeven = req.query.includeBreakeven === 'true';
        const considerPotentialOutcome = req.query.considerPotentialOutcome === 'true';
        
        // Get unique years and currency pairs for filters
        const years = [...new Set(trades.map(trade => 
            moment(trade.openTime).year()
        ))].sort();
        
        const pairs = [...new Set(trades.map(trade => 
            trade.currencyPair
        ))].sort();

        // Apply filters if present
        let filteredTrades = trades;
        if (req.query.year) {
            filteredTrades = filteredTrades.filter(trade => 
                moment(trade.openTime).year() === parseInt(req.query.year)
            );
        }
        if (req.query.pair) {
            filteredTrades = filteredTrades.filter(trade => 
                trade.currencyPair === req.query.pair
            );
        }

        const stats = statistics.calculateStats(
            filteredTrades, 
            includeBreakeven,
            considerPotentialOutcome
        );

        res.render('dashboard', {
            trades: filteredTrades,
            stats,
            years,
            pairs,
            filters: req.query,
            formatDuration: statistics.formatDuration.bind(statistics)
        });
    } catch (error) {
        res.status(500).render('dashboard', { error: error.message });
    }
});

module.exports = router; 