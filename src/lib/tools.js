import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/images/products");

const productsJSONpath = join(dataFolderPath, "/products.json");

export const getProducts = () => readJSON(productsJSONpath);
export const writeProducts = (prodArray) =>
  writeJSON(productsJSONpath, prodArray);

export const saveProdImg = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsBuffer);

const reviewsJSONpath = join(dataFolderPath, "/reviews.json");

export const getReviews = () => readJSON(reviewsJSONpath);
export const writeReviews = (reviewArray) =>
  writeJSON(reviewsJSONpath, reviewArray);
