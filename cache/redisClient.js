const redis = require('redis');

const REDIS_URL =
  process.env.REDIS_UPSTASH_URL || process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
  url: REDIS_URL,
});

redisClient
  .connect()
  .then(async () => {
    console.log('Redis connect successful!');
  })
  .catch((error) => console.log(error));

module.exports = redisClient;
