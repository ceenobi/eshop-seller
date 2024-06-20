import { handleError } from "@/utils";

const tryCatchFn = (fn) => async (param) => {
  if (typeof fn === "function") {
    try {
      await fn(param);
    } catch (error) {
      handleError(error);
      console.error(error);
    }
  }
};

export default tryCatchFn;
