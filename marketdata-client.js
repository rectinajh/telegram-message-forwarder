const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/marketdata.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const marketdataProto = grpc.loadPackageDefinition(packageDefinition).marketdata;

const client = new marketdataProto.MarketDataService(
  'localhost:50051', // Replace with your real gRPC server address
  grpc.credentials.createInsecure()
);

function getMarketData(token) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    client.GetMarketData({ token }, (error, response) => {
      const latency = Date.now() - start;
      if (error) {
        return reject(error);
      }
      if (latency > 500) {
        console.warn(`Warning: Market data latency ${latency}ms exceeds 500ms`);
      }
      resolve({ ...response, latency });
    });
  });
}

// Example usage:
getMarketData('SOL').then(data => {
  console.log('Market Data:', data);
}).catch(console.error);

module.exports = { getMarketData };