import { formattedDate, formatDate, formatCurrency } from "./format";
import {
  pageLinks,
  settingsLink,
  currency,
  state,
  country,
  orderProgress,
} from "./links";
import http from "./http";
import tryCatchFn from "./tryCatchFn";
import handleError from "./handleError";
import validateFields from "./formValidate";
import generateDiscountCode from "./generateDiscount";

export {
  formattedDate,
  formatDate,
  pageLinks,
  settingsLink,
  currency,
  http,
  tryCatchFn,
  handleError,
  validateFields,
  state,
  country,
  generateDiscountCode,
  formatCurrency,
  orderProgress,
};
