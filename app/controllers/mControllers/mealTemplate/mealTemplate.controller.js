import Controller from "../../";

// Services
import MealTemplateService from "../../../services/mealTemplate/mealTemplate.service";

//Wrappers
import MealTemplateWrapper from "../../../ApiWrapper/mobile/mealTemplate";

import Logger from "../../../../libs/log";

const Log = new Logger("MOBILE > MEAL_TEMPLATE > CONTROLLER");

class MealTemplateController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            Log.debug("create meal template request", req.body);
            const {
                body,
                userDetails: {
                    userCategoryId = null,
                    userData: {category = null} = {},
                } = {},
            } = req;
            const {food_item_detail_ids: foodItemDetails = [], name = ""} = body || {};

            const mealTemplateService = new MealTemplateService();

            const mealTemplateExistsForName =
                await mealTemplateService.findOne({
                    name,
                }) || null;

            if (mealTemplateExistsForName) {
                return raiseClientError(
                    res,
                    422,
                    {},
                    `Meal Template already exists with ${name}`
                );
            }

            const mealTemplateId =
                (await mealTemplateService.create({
                    meal: {
                        name,
                        creator_id: userCategoryId,
                        creator_type: category,
                    },
                    foodItemDetails,
                })) || null;

            if (mealTemplateId !== null) {
                const mealTemplates = await MealTemplateWrapper({id: mealTemplateId});

                return raiseSuccess(
                    res,
                    200,
                    {
                        ...(await mealTemplates.getReferenceInfo()),
                    },
                    "Meal Template created successfully"
                );
            } else {
                return raiseClientError(
                    res,
                    422,
                    {},
                    "Please verify the details shared and try again"
                );
            }
        } catch (error) {
            Log.debug("create Meal Template  500 error", error);
            return raiseServerError(res);
        }
    };

    update = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            Log.debug("update meal template request", req.body);
            const {
                params: {id} = {},
                body: {name, food_item_detail_ids: foodItemDetails = []} = {},
            } = req;

            const mealTemplateService = new MealTemplateService();

            const mealTemplateExists = await mealTemplateService.findOne({id}) || null;

            if (!mealTemplateExists) {
                return raiseClientError(res, 422, {}, "Meal Template to be updated does not exists");
            }

            const mealTemplate = await mealTemplateService.findOne({name});
            if (mealTemplate) {
                const {id: existingId = null} = mealTemplate || {};
                if (id.toString() !== existingId.toString()) {
                    return raiseClientError(res, 422, {}, "Meal Template with same name exists");
                }
            }

            const isMealTemplateUpdate = await mealTemplateService.update({
                meal: {
                    name,
                },
                foodItemDetails,
                id,
            });

            if (!isMealTemplateUpdate) {
                return raiseClientError(
                    res,
                    422,
                    {},
                    `No Meal Template exists with name ${name}`
                );
            }

            const updatedMealTemplate = await MealTemplateWrapper({
                id
            });

            return raiseSuccess(
                res,
                200,
                {
                    ...(await updatedMealTemplate.getReferenceInfo()),
                },
                "Meal Template updated successfully"
            );
        } catch (error) {
            Log.debug("update Meal Template  500 error", error);
            return raiseServerError(res);
        }
    };

    delete = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {
                params: {id: template_id} = {}
            } = req;

            const mealTemplateService = new MealTemplateService();

            const templateFound = await mealTemplateService.findOne({id: template_id});

            if (templateFound) {
                const deleted = await mealTemplateService.delete({
                    template_id
                });

                return raiseSuccess(res, 200, {}, "Meal Template deleted");
            } else {
                return raiseSuccess(res, 422, {}, "Meal Template to be deleted does not exists");
            }
        } catch (error) {
            Log.debug("delete Meal Template  500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new MealTemplateController();
