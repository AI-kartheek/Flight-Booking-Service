const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron-jobs');

const app = express();

// below lines of code is a middlewares that parases the req.body of type json or urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT :- ${ServerConfig.PORT}`);
    CRON();
});