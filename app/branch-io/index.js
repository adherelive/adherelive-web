import axios from "axios";

export default async function createLink(data = {}) {
  try {
    const res = await axios.post(process.config.branch_io.base_url, {
      branch_key: process.config.branch_io.key,
      data
    });

    console.log("dara====", data);

    const { status } = res;
    if (status === 200) {
      const { data: { url } = {} } = res;
      return url;
    }
  } catch (err) {
    console.log(
      "err creating universal deep-link",
      err,
      process.config.branch_io
    );
  }

  return;
}
