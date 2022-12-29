import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest, NotFound } = createHttpError;

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Product name is a mandatory field. Must be a string.",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field. Must be a string.",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Product brand is a mandatory field. Must be a string.",
    },
  },
  price: {
    in: ["body"],
    isNumeric: true,
    errorMessage: "Product price is mandatory and must be a number.",
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is mandatory and must be a string.",
    },
  },
};

export const checkProdSchema = checkSchema(productSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during product validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
