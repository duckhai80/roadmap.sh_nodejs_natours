const redisClient = require('./redisClient');

const getCache = async (key) => {
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

exports.cacheAPI = (prefixKey) => {
  return async (req, res, next) => {
    try {
      const cacheKey = `${prefixKey}:${req.originalUrl}`;
      const cachedData = await getCache(cacheKey);

      req.prefixKey = prefixKey;

      if (cachedData) {
        res.status(200).json(cachedData);
      } else {
        next();
      }
    } catch (error) {
      console.error('Cache error:', error);

      next();
    }
  };
};

exports.cacheView = (template) => {
  return async (req, res, next) => {
    try {
      const cacheKey = `${template}:${req.originalUrl}`;
      const cachedData = await getCache(cacheKey);

      req.template = template;

      if (cachedData) {
        res.status(200).render(template, cachedData);
      } else {
        next();
      }
    } catch (error) {
      console.error('Cache error:', error);

      next();
    }
  };
};

exports.getCache = getCache;
