const Joi = require('joi');

// Market Data Schema
const marketDataSchema = Joi.object({
    symbol: Joi.string().required(),
    price: Joi.number().positive().required(),
    marketCap: Joi.number().positive().required(),
    holders: Joi.number().integer().min(0).required(),
    liquidity: Joi.number().positive().required(),
    timestamp: Joi.date().iso().required()
});

// Trade Request Schema
const tradeRequestSchema = Joi.object({
    symbol: Joi.string().required(),
    side: Joi.string().valid('BUY', 'SELL').required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    clientId: Joi.string().required(),
    timestamp: Joi.date().iso().required()
});

// Validation Functions
const validateMarketData = (data) => {
    const { error, value } = marketDataSchema.validate(data);
    if (error) {
        throw new Error(`Market data validation failed: ${error.message}`);
    }
    return value;
};

const validateTradeRequest = (data) => {
    const { error, value } = tradeRequestSchema.validate(data);
    if (error) {
        throw new Error(`Trade request validation failed: ${error.message}`);
    }
    return value;
};

module.exports = {
    validateMarketData,
    validateTradeRequest,
    marketDataSchema,
    tradeRequestSchema
}; 