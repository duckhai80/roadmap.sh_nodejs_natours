const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);

redisClient
  .connect()
  .then(async () => {
    console.log('Redis connect successful!');
  })
  .catch((error) => console.log(error));

module.exports = redisClient;
