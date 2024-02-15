// cors-config.js
const corsOptions = {
    origin: 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
  module.exports = corsOptions;
  