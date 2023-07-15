require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//extra security packages
const helmet = require('helmet')
const cors = require("cors")
const xss = require ('xss-clean')
const ratelimit = require('express-rate-limit')




//connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routes
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
app.use(ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(helmet())
app.use(cors())
app.use(xss())
// routes
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/jobs',authenticateUser,jobsRoute)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONG0_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
