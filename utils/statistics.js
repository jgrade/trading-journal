class Statistics {
    calculateStats(trades, includeBreakeven = false, considerPotentialOutcome = false) {
        const total = trades.length;
        if (total === 0) return {
            winRate: 0,
            lossRate: 0,
            breakevenRate: 0,
            avgTradeTime: 0,
            totalTrades: total,
            totalWins: 0,
            totalLosses: 0,
            totalBreakevens: 0,
            rr: 0
        };

        let wins = trades.filter(trade => trade.outcome === 'TP').length;
        let losses = trades.filter(trade => trade.outcome === 'SL').length;
        let breakevens = trades.filter(trade => trade.outcome === 'BE').length;

        // Calculate RR (3 for wins, -1 for losses)
        const rr = (wins * 3) + (losses * -1);

        // Consider potential outcomes for BE trades
        if (considerPotentialOutcome) {
            const beTradesWithPotential = trades.filter(trade => 
                trade.outcome === 'BE' && trade.potentialOutcome
            );
            
            beTradesWithPotential.forEach(trade => {
                if (trade.potentialOutcome === 'TP') wins++;
                if (trade.potentialOutcome === 'SL') losses++;
                breakevens--;
            });
        }

        // Calculate average trade time
        const tradeTimes = trades.map(trade => {
            const openTime = new Date(trade.openTime);
            const closeTime = new Date(trade.closeTime);
            return (closeTime - openTime) / (1000 * 60); // Convert to minutes
        });
        const avgTradeTime = tradeTimes.reduce((acc, time) => acc + time, 0) / total;

        let winRate, lossRate, breakevenRate;

        if (includeBreakeven) {
            // Count all BE trades as TP
            winRate = ((wins + breakevens) / total) * 100;
            lossRate = (losses / total) * 100;
            breakevenRate = 0; // Since we're counting BE as wins
        } else {
            winRate = (wins / total) * 100;
            lossRate = (losses / total) * 100;
            breakevenRate = (breakevens / total) * 100;
        }

        return {
            winRate: Math.round(winRate * 100) / 100,
            lossRate: Math.round(lossRate * 100) / 100,
            breakevenRate: Math.round(breakevenRate * 100) / 100,
            avgTradeTime: Math.round(avgTradeTime * 100) / 100,
            totalTrades: total,
            totalWins: wins,
            totalLosses: losses,
            totalBreakevens: breakevens,
            rr: rr
        };
    }

    // Helper function to format time duration
    formatDuration(minutes) {
        const days = Math.floor(minutes / (60 * 24));
        const hours = Math.floor((minutes % (60 * 24)) / 60);
        const remainingMinutes = Math.round(minutes % 60);
        
        if (days === 0 && hours === 0) {
            return `${remainingMinutes}m`;
        } else if (days === 0) {
            return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
        } else if (hours === 0 && remainingMinutes === 0) {
            return `${days}d`;
        } else if (remainingMinutes === 0) {
            return `${days}d ${hours}h`;
        } else {
            return `${days}d ${hours}h ${remainingMinutes}m`;
        }
    }
}

module.exports = new Statistics(); 