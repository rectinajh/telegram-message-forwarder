const RiskEngine = require('./risk-rules');

// Create sample market data
const marketData = {
    symbol: 'BTC/USDT',
    price: 50000,
    marketCap: 1000000000,
    holders: 150,
    liquidity: 200000,
    timestamp: new Date().toISOString()
};

// Create sample trade request
const tradeRequest = {
    symbol: 'BTC/USDT',
    side: 'BUY',
    quantity: 1,
    price: 50100,
    clientId: 'test-client-001',
    timestamp: new Date().toISOString()
};

// Initialize risk engine with custom config
const riskEngine = new RiskEngine({
    maxTradeSize: 100000,
    maxPriceDeviation: 0.1,
    minLiquidity: 50000,
    minHolders: 100,
    maxMarketImpact: 0.05
});

// Run risk checks
async function runRiskChecks() {
    try {
        console.log('Running risk checks...');
        console.log('\nMarket Data:', JSON.stringify(marketData, null, 2));
        console.log('\nTrade Request:', JSON.stringify(tradeRequest, null, 2));

        const results = await riskEngine.checkRiskRules(tradeRequest, marketData);
        console.log('\nRisk Check Results:', JSON.stringify(results, null, 2));

        // Test with invalid data
        const invalidTrade = { ...tradeRequest, price: -1 };
        console.log('\nTesting with invalid trade data...');
        const invalidResults = await riskEngine.checkRiskRules(invalidTrade, marketData);
        console.log('Invalid Trade Results:', JSON.stringify(invalidResults, null, 2));

    } catch (error) {
        console.error('Error running risk checks:', error);
    }
}

// Run the tests
runRiskChecks(); 