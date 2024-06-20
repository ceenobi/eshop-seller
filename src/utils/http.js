import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;
const TIMEOUTMSG = "Waiting for too long...Aborted !";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: TIMEOUTMSG,
};
// config.headers["cache-control"] = `no-cache`;
const http = axios.create(config);

export default http;
