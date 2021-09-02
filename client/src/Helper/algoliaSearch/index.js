import algoliasearch from "algoliasearch";
import config from "../../config";

export const algoliaSearchHelper = async (input = " ") => {
  const algoliaClient = algoliasearch(
    config.algolia.app_id,
    config.algolia.app_key
  );
  const index = algoliaClient.initIndex(config.algolia.medicine_index);
  const response = await index.search(input);
  // console.log("38926745237469732084",{input,response});
  const { hits = {} } = response;
  return hits;
};
