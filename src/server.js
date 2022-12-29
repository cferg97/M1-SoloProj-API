import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import productRouter from "./products/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandler.js";

const publicFolderPath = join(process.cwd(), "./public");
const server = express();

const port = 3001;

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
