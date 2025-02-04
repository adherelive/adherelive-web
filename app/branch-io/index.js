import axios from "axios";

import { createLogger } from "../../libs/logger";

const logger = createLogger("BRANCH IO");

export default async function createLink(data = {}) {
  try {
    // return data.$desktop_url;
    // TODO: Write default Android and iOS redirects
    const res = await axios.post(process.config.branch_io.base_url, {
      branch_key: process.config.branch_io.key,
      data,
    });

    const { status } = res;
    if (status === 200) {
      const { data: { url } = {} } = res;
      return url;
    }
  } catch (err) {
    logger.error("Error creating the universal deep-link: ", err);
  }
}
