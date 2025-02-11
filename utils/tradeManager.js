const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class TradeManager {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/trades.json');
    }

    async initializeStorage() {
        try {
            await fs.access(this.dataPath);
        } catch {
            await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
            await fs.writeFile(this.dataPath, JSON.stringify([]));
        }
    }

    async getAllTrades() {
        await this.initializeStorage();
        const data = await fs.readFile(this.dataPath, 'utf8');
        return JSON.parse(data);
    }

    async addTrade(tradeData) {
        const trades = await this.getAllTrades();
        const newTrade = {
            id: uuidv4(),
            currencyPair: tradeData.currencyPair,
            tradeType: tradeData.tradeType,
            trend: tradeData.trend,
            openTime: tradeData.openTime,
            closeTime: tradeData.closeTime,
            outcome: tradeData.outcome,
            potentialOutcome: tradeData.outcome === 'Breakeven' ? tradeData.potentialOutcome : null,
            setupUrl: tradeData.setupUrl,
            notes: tradeData.notes,
            createdAt: new Date().toISOString()
        };

        trades.push(newTrade);
        await fs.writeFile(this.dataPath, JSON.stringify(trades, null, 2));
        return newTrade;
    }

    async updateTrade(id, tradeData) {
        const trades = await this.getAllTrades();
        const index = trades.findIndex(trade => trade.id === id);
        
        if (index === -1) throw new Error('Trade not found');
        
        trades[index] = { ...trades[index], ...tradeData };
        await fs.writeFile(this.dataPath, JSON.stringify(trades, null, 2));
        return trades[index];
    }

    async deleteTrade(id) {
        const trades = await this.getAllTrades();
        const filteredTrades = trades.filter(trade => trade.id !== id);
        await fs.writeFile(this.dataPath, JSON.stringify(filteredTrades, null, 2));
    }
}

module.exports = new TradeManager(); 