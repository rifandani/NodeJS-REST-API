module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'secret1',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb://rifandani:rifandani@cluster0-shard-00-00-a7b7z.mongodb.net:27017/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primaryPreferred&appname=MongoDB%20Compass&ssl=true',
};
