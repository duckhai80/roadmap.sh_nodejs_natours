const redisClient = require('./redisClient');

exports.getCache = async (key) => {
  try {
    const data = await redisClient.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log(error);

    return null;
  }
};

exports.setCache = async (key, value, ttl = 60) => {
  try {
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    console.error(error);
  }
};

exports.deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(error);
  }
};
