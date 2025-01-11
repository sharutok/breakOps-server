const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./Router/Route');
const { redisConnect } = require('./DbConnections/redisconfig');
require('dotenv').config({ path: './.env' });

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(morgan('combined'));
app.use('/api/v1', router);

app.get('/health', async (req, res) => {
  res.status(200).json('ok');
});

(async () => {
  console.log('Initializing Redis keys...');

  try {
    const r = await redisConnect(); // Connect to Redis

    // Check and set keys if they don't exist
    const keysToInitialize = {
        dashboard_output: JSON.stringify([]),
        ignored_equipment_id: JSON.stringify([]),
        list_of_all_equipment: JSON.stringify([])
    };

    for (const [key, value] of Object.entries(keysToInitialize)) {
      const exists = await r.exists(key);
      if (!exists) {
        await r.set(key, value);
        console.log(`Key "${key}" initialized with value: "${value}"`);
      } else {
        console.log(`Key "${key}" already exists.`);
      }
    }

    // Close the Redis connection
    await r.quit();
    console.log('Redis initialization complete.');
  } catch (err) {
    console.error('Error during Redis initialization:', err);
  }
})();

module.exports = app;
