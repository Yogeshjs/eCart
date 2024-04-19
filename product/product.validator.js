import { body, validationResult } from "express-validator";

export { validationResult };

// title, price, stock, category, thumbnail, tenantId

const validateTitle = body("title")
  .exists({ checkFalsy: true })
  .withMessage("title is required")
  .bail()
  .isString()
  .withMessage("title has to be a proper text");

const validatePrice = body("price")
  .exists({ checkFalsy: true })
  .withMessage("price is required")
  .bail()
  .isInt()
  .withMessage("price has to be a numeric")
  .bail()
  .customSanitizer((value, { req }) => {
    return Number(value);
  });

const validateStock = body("stock")
  .exists({ checkFalsy: true })
  .withMessage("stock is required")
  .bail()
  .isInt()
  .withMessage("stock has to be a numeric")
  .bail()
  .customSanitizer((value, { req }) => {
    return Number(value);
  });

const validateCategory = body("category")
  .exists({ checkFalsy: true })
  .withMessage("category is required")
  .bail()
  .isString()
  .withMessage("category has to be a proper text");

const validateThumbnail = body("thumbnail")
  .exists({ checkFalsy: true })
  .withMessage("thumbnail is required")
  .bail()
  .isDataURI()
  .withMessage("thumbnail has to be a proper text");

const validateTenantId = body("tenantId")
  .exists({ checkFalsy: true })
  .withMessage("tenantId is required")
  .bail()
  .isString()
  .withMessage("title has to be a proper text");

export const validateProduct = [
  validateTitle,
  validatePrice,
  validateStock,
  validateCategory,
  validateTenantId,
];
