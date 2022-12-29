import express from "express";
import uniqid from "uniqid";
import { getProducts, writeProducts, saveProdImg } from "../lib/tools.js";
import { checkProdSchema, triggerBadRequest } from "./validator.js";
import { checkReviewSchema } from "../reviews/validator.js";
import { triggerBadCommentRequest } from "../reviews/validator.js";
import { getReviews, writeReviews } from "../lib/tools.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res, next) => {
  try {
    const prodArray = await getProducts();
    if (req.query && req.query.category) {
      const filteredProds = prodArray.filter(
        (prod) => prod.category === req.query.category
      );
      res.send(filteredProds);
    } else {
      res.send(prodArray);
    }
  } catch (err) {
    next(err);
  }
});

productRouter.get("/:productid", async (req, res, next) => {
  try {
    const prods = await getProducts();
    const prod = prods.find((product) => product.id === req.params.productid);
    if (prod) {
      res.send(prod);
    } else {
      res.status(404).send("product not found");
    }
  } catch (err) {
    next(err);
  }
});

productRouter.post(
  "/",
  checkProdSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newProd = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
      };
      const prodArray = await getProducts();
      prodArray.push(newProd);
      await writeProducts(prodArray);
      res.status(201).send({ id: newProd.id });
    } catch (err) {
      next(err);
    }
  }
);

productRouter.put("/:productid", async (req, res, next) => {
  try {
    const prods = await getProducts();
    const index = prods.findIndex((prod) => prod.id === req.params.productid);
    const oldProd = prods[index];
    const updatedProd = { ...oldProd, ...req.body, updatedAt: new Date() };
    prods[index] = updatedProd;
    writeProducts(prods);
    res.status(201).send(updatedProd);
  } catch (err) {
    next(err);
  }
});

productRouter.delete("/:productid", async (req, res, next) => {
  try {
    const prods = await getProducts();
    const remainingProds = prods.filter(
      (prod) => prod.id !== req.params.productid
    );
    if (prods.length !== remainingProds.length) {
      await writeProducts(remainingProds);
      res.send("Deleted.");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    next(err);
  }
});

productRouter.post("/:productid/reviews", async (req, res, next) => {
  try {
    const newReview = {
      ...req.body,
      productID: req.params.productid,
      id: uniqid(),
      createdAt: new Date(),
    };
    const reviews = await getReviews();
    reviews.push(newReview);
    await writeReviews(reviews);
    res.status(201).send(newReview);
  } catch (err) {
    next(err);
  }
});

productRouter.get("/:productid/reviews/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const reviewsMatch = reviews.filter((r) =>
      r.productID.includes(req.params.productid)
    );
    if (reviewsMatch) {
      res.status(200).send(reviewsMatch);
    } else {
      res.status(404).send("No matches found.");
    }
  } catch (err) {
    next(err);
  }
});

productRouter.get("/:productid/reviews/:reviewid", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((r) => r.id === req.params.reviewid);
    if (review) {
      res.send(review);
    } else {
      res.status(404).send("Review not found.");
    }
  } catch (err) {
    next(err);
  }
});

export default productRouter;