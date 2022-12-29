import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is a mandatory field and must be a string.",
    },
  },
  rate: {
    isInt: {
      options: { min: 1, max: 5 },
    },
    errorMessage:
      "Product must have a rating of a whole number between 1 and 5.",
  },
};

export const triggerBadCommentRequest = (req, res, next) => {
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

export const checkReviewSchema = checkSchema(reviewSchema);
