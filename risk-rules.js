const { validateMarketData, validateTradeRequest } = require('./validation-schema');

class RiskEngine {
    constructor(config = {}) {
        this.config = {
            maxTradeSize: config.maxTradeSize || 100000, // Maximum trade size in base currency
            maxPriceDeviation: config.maxPriceDeviation || 0.1, // Maximum 10% price deviation
            minLiquidity: config.minLiquidity || 50000, // Minimum liquidity requirement
            minHolders: config.minHolders || 100, // Minimum number of holders
            maxMarketImpact: config.maxMarketImpact || 0.05 // Maximum 5% market impact
        };
    }

    // Calculate market impact
    calculateMarketImpact(tradeSize, liquidity) {
        return tradeSize / liquidity;
    }

    // Check if price deviation is within limits
    checkPriceDeviation(marketPrice, orderPrice) {
        const deviation = Math.abs(marketPrice - orderPrice) / marketPrice;
        return deviation <= this.config.maxPriceDeviation;
    }

    // Main risk check function
    async checkRiskRules(tradeRequest, marketData) {
        try {
            // Validate input data
            const validatedTrade = validateTradeRequest(tradeRequest);
            const validatedMarket = validateMarketData(marketData);

            const riskCheckResults = {
                passed: true,
                checks: {},
                message: 'All risk checks passed'
            };

            // Check 1: Trade Size
            const tradeSize = validatedTrade.quantity * validatedTrade.price;
            riskCheckResults.checks.tradeSizeCheck = tradeSize <= this.config.maxTradeSize;

            // Check 2: Price Deviation
            riskCheckResults.checks.priceDeviationCheck = this.checkPriceDeviation(
                validatedMarket.price,
                validatedTrade.price
            );

            // Check 3: Liquidity
            riskCheckResults.checks.liquidityCheck = validatedMarket.liquidity >= this.config.minLiquidity;

            // Check 4: Holders
            riskCheckResults.checks.holdersCheck = validatedMarket.holders >= this.config.minHolders;

            // Check 5: Market Impact
            const marketImpact = this.calculateMarketImpact(tradeSize, validatedMarket.liquidity);
            riskCheckResults.checks.marketImpactCheck = marketImpact <= this.config.maxMarketImpact;

            // Aggregate results
            riskCheckResults.passed = Object.values(riskCheckResults.checks).every(check => check);
            
            if (!riskCheckResults.passed) {
                const failedChecks = Object.entries(riskCheckResults.checks)
                    .filter(([, passed]) => !passed)
                    .map(([check]) => check)
                    .join(', ');
                riskCheckResults.message = `Risk check failed: ${failedChecks}`;
            }

            return riskCheckResults;

        } catch (error) {
            return {
                passed: false,
                checks: {},
                message: `Risk check error: ${error.message}`
            };
        }
    }
}

module.exports = RiskEngine; 