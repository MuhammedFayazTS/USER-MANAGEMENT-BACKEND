import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/app.config";

import db from "./database/database";
import { errorHandler } from "./middleware/errorHandler";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middleware/asyncHandler";
import { routes as initializeRoutes } from "./routes";
import { initializePassport } from "./middleware/passport";
import morgan from "morgan";
import logger from "./common/utils/logger";
import session from "express-session";
import passport from "passport";
import { getSessionCookieOptions } from "./common/utils/cookie";
import paginate from "express-paginate";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// Set up session management with express-session
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: getSessionCookieOptions(),
  })
);

app.use("/public", express.static("public"));

app.use(initializePassport());
app.use(passport.session());

app.use(paginate.middleware(10, 50));

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) =>
    res.status(HTTPSTATUS.OK).json({
      message: "Health check successful",
    })
  )
);

//logger
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Routes
initializeRoutes(app);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT}`);
  await db.connectDB();
});
