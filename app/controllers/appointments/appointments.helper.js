import { createLogger } from "../../../libs/log";
import { FAVOURITE_TYPE, MEDICAL_TEST } from "../../../constant";

// Services
import FavoriteService from "../../services/userFavourites/userFavourites.service";

const log = createLogger("APPOINTMENT > HELPER");

export const getFavoriteInDetails = async (
  userTypeData,
  typeDescription,
  type
) => {
  try {
    let response = {};

    switch (type) {
      case FAVOURITE_TYPE.MEDICAL_TESTS:
        const medicalTestTypes = await medicalTestFavorites(
          userTypeData,
          typeDescription[MEDICAL_TEST]
        );
        response = {
          ...typeDescription,
          ...{ [MEDICAL_TEST]: medicalTestTypes },
        };
        return response;
      case FAVOURITE_TYPE.RADIOLOGY:
        const radiologyTypes = await radiologyTypeFavorites(
          userTypeData,
          typeDescription
        );
        response = radiologyTypes;
        return response;
    }
  } catch (error) {
    log.debug("getFavouriteInDetails error", error);
    return null;
  }
};

const medicalTestFavorites = async (userTypeData, types) => {
  try {
    const { id: user_category_id, category: user_category_type } =
      userTypeData || {};
    const allMedicalTestFavorites =
      (await FavoriteService.getAllFavourites({
        user_category_id,
        user_category_type,
        marked_favourite_type: FAVOURITE_TYPE.MEDICAL_TESTS,
      })) || [];

    let favoriteIndices = {};

    for (const medicalTestFavorite of allMedicalTestFavorites) {
      const { marked_favourite_id = null, id = null } = medicalTestFavorite;
      favoriteIndices[marked_favourite_id] = id;
    }

    const favIndicesList = Object.keys(favoriteIndices);
    let updatedTypes = [],
      favTypesList = [],
      notFavTypesList = [];
    for (const [idx, type] of types.entries()) {
      let favoriteId = null;
      if (favIndicesList.indexOf(`${idx}`) > -1) {
        favoriteId = favoriteIndices[idx];
        favTypesList.push({ name: type, favorite_id: favoriteId, index: idx });
      } else {
        notFavTypesList.push({
          name: type,
          favorite_id: favoriteId,
          index: idx,
        });
      }
    }

    updatedTypes = [...favTypesList, ...notFavTypesList];
    return updatedTypes;
  } catch (error) {
    log.debug("medicalTestFavorites error", error);
  }
};

const radiologyTypeFavorites = async (userTypeData, types) => {
  try {
    const { id: user_category_id, category: user_category_type } =
      userTypeData || {};
    const allRadiologyFavorites =
      (await FavoriteService.getAllFavourites({
        user_category_id,
        user_category_type,
        marked_favourite_type: FAVOURITE_TYPE.RADIOLOGY,
      })) || [];

    let favoriteIndices = {};

    for (const radiologyFavorite of allRadiologyFavorites) {
      const {
        marked_favourite_id = null,
        id = null,
        details: {
          sub_category_id = null,
          selected_radiology_index = null,
        } = {},
      } = radiologyFavorite;

      if (
        marked_favourite_id !== null &&
        sub_category_id !== null &&
        selected_radiology_index !== null
      ) {
        favoriteIndices[
          `${marked_favourite_id}-${sub_category_id}-${selected_radiology_index}`
        ] = id;
      }
    }

    const favIndicesList = Object.keys(favoriteIndices);

    for (const typeId of Object.keys(types)) {
      const { [typeId]: { data = {}, id = null, name: typeName } = {} } =
        types || {};

      let typeData = { ...data };

      const subTypesIds = Object.keys(typeData);

      for (const subTypeId of subTypesIds) {
        const {
          [subTypeId]: {
            index = null,
            items = [],
            name: subTypeName = "",
          } = {},
        } = typeData || {};
        let updatedItems = [];
        let favoriteItems = [];
        let nonFavoriteItems = [];
        for (const [idx, type] of items.entries()) {
          let favoriteId = null;
          if (favIndicesList.indexOf(`${id}-${index}-${idx}`) !== -1) {
            favoriteId = favoriteIndices[`${id}-${index}-${idx}`];
            favoriteItems.push({ name: type, favorite_id: favoriteId });
          } else {
            nonFavoriteItems.push({ name: type, favorite_id: null });
          }
        }
        updatedItems = [...favoriteItems, ...nonFavoriteItems];
        typeData = {
          ...typeData,
          [subTypeId]: { name: subTypeName, index, items: updatedItems },
        };
      }

      types = { ...types, [typeId]: { id, data: typeData, name: typeName } };
    }
    return types;
  } catch (error) {
    log.debug("medicalTestFavorites error", error);
  }
};
