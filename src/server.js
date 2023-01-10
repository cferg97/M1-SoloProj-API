import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import * as dotenv from "dotenv";
import { join } from "path";
import productRouter from "./products/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandler.js";
import createHttpError from "http-errors";
dotenv.config();
const publicFolderPath = join(process.cwd(), "./public");
const server = express();

const port = process.env.PORT;

const whitelist = [process.env.BE_DEV_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, `${origin} is not on Whitelist`));
    }
  },
};

server.use(express.static(publicFolderPath));
server.use(express.json());
server.use(cors());

server.use("/products", productRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
