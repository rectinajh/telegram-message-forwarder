const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/marketdata.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const marketdataProto = grpc.loadPackageDefinition(packageDefinition).marketdata;

function GetMarketData(call, callback) {
  // Simulate real-time data
  callback(null, {
    token: call.request.token,
    liquidity: 123456.78,
    mc: 9876543.21,
    order_book: [
      { side: 'buy', price: 1.23, amount: 100 },
      { side: 'sell', price: 1.25, amount: 80 }
    ],
    timestamp: Date.now()
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(marketdataProto.MarketDataService.service, { GetMarketData });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Mock gRPC MarketData server running on port 50051');
  });
}

if (require.main === module) {
  main();
}