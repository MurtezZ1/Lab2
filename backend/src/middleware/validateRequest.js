import { AppError } from "../utils/AppError.js";

export function validateRequest(validator) {
  return (req, _res, next) => {
    const result = validator(req.body);
    if (result?.error) {
      return next(new AppError("Validation failed.", 400, result.error));
    }
    next();
  };
}
