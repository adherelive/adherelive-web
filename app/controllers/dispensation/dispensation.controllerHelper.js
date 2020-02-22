import isEmpty from "lodash/isEmpty";
import benefitService from "../../services/benefitPlan/benefitPlan.service";
import userService from "../../services/user/user.service";
import productService from "../../services/product/product.service";
import InsuranceService from "../../services/insurance/insurance.service";
import CharityService from "../../services/charity";
import CharityAppliedService from "../../services/charitiesApplied/charitiesApplied.service";
import contributionService from "../../services/contributions/contribution.service";
import programService from "../../services/program/program.service";
import CityCountryService from "../../services/cityCountry/cityCountry.service";

import { CONTRIBUTION_TYPE } from "../../../constant";
const { OOP, COPAY, INSURANCE, CHARITY } = CONTRIBUTION_TYPE;

export const prepareMRLUserData = async benefitId => {
  try {
    const benefitPlan = await benefitService.getBenefitPlanById(benefitId);
    //   console.log("benefitPlan================ :", benefitPlan);
    const { userId } = benefitPlan;
    if (userId) {
      const userData = await userService.getUserById(userId);
      // console.log("userData-------------- :", userData);
      const {
        basicInfo: { name } = {},
        personalInfo: { contactNo = {} } = {},
        programId = []
      } = userData;

      const userCareCoach = await programService.getCareCoachOfUser(
        userId,
        programId[0]
      );
      const { careCoaches } = userCareCoach;
      const careCoachId = careCoaches[0].id || "";
      const careCoachData = await userService.getUserById(careCoachId);
      const {
        personalInfo: {
          contactNo: careCoachContact = {},
          homeAddress: { country } = {}
        } = {}
      } = careCoachData;
      const program = await programService.getProgram({ _id: programId[0] });
      const { programCode } = program;
      const pharmacy = await CityCountryService.getPharmaciesByCountries(
        country
      );
      // console.log("pharmacy=================== :", pharmacy);
      const preparedData = {
        patientName: name,
        patientContactNum: isEmpty(contactNo)
          ? ""
          : `${contactNo.countryCode}-${contactNo.phoneNumber}`,
        careCoachContactNum: isEmpty(careCoachContact)
          ? ""
          : `${careCoachContact.countryCode}-${careCoachContact.phoneNumber}`,
        programId: programCode,
        pharmacy
      };

      return preparedData;
    }
    return {};
  } catch (error) {
    console.log("error---------------------- :", error);
  }
};

export const prepareMRLContributionData = async ({
  contributionId,
  products
}) => {
  try {
    const contribution = await contributionService.getContributionById(
      contributionId
    );
    const {
      [OOP]: oopData = {},
      [COPAY]: copayData = {},
      [INSURANCE]: insuranceData = {},
      [CHARITY]: charityData = []
    } = contribution;
    let oop = {};
    let coPay = {};
    let insurance = [];
    let charity = [];
    const productIds = Object.keys(products);
    const productData = await productService.getProducts(productIds);
    const productObject = {};
    let totalAmount = 0;
    productData.forEach(product => {
      const { _id } = product;
      productObject[_id] = product;
      const { amount = 0 } = products[_id] || {};
      totalAmount += amount;
    });
    const { products: oopProducts = {}, amount: oopAmount = 0 } = oopData;
    const oopProductIds = Object.keys(oopProducts);
    oop.amount = oopAmount;
    oop.percent = ((oopAmount / totalAmount) * 100).toFixed(2);
    oop.products = [];
    oopProductIds.forEach(id => {
      const { name } = productObject[id] || {};
      const { packs, amount } = oopProducts[id] || {};
      const temp = {};
      temp.productName = name;
      temp.packs = packs;
      temp.amount = amount;
      oop.products.push(temp);
    });

    const { products: copayProducts = {}, amount: copayAmount = 0 } = copayData;
    const copayProductIds = Object.keys(copayProducts);
    coPay.amount = copayAmount;
    coPay.percent = ((copayAmount / totalAmount) * 100).toFixed(2);
    coPay.products = [];
    copayProductIds.forEach(id => {
      const { name } = productObject[id] || {};
      const { packs, amount } = copayProducts[id] || {};
      const temp = {};
      temp.productName = name;
      temp.packs = packs;
      temp.amount = amount;
      coPay.products.push(temp);
    });

    const { insurancesApplied = [], insurances = {} } = insuranceData;
    for (const insuranceId of insurancesApplied) {
      const insuranceData = await InsuranceService.getInsuranceProviderById(
        insuranceId
      );
      const insuranceObject = {};
      const { providerName: insuranceName } = insuranceData || {};
      const { products: insuranceProduct = {}, amount: insuranceAmount = 0 } =
        insurances[insuranceId] || {};
      const insuranceProductIds = Object.keys(insuranceProduct);
      insuranceObject.insuranceName = insuranceName;
      insuranceObject.amount = insuranceAmount;
      insuranceObject.percent = ((insuranceAmount / totalAmount) * 100).toFixed(
        2
      );
      insuranceObject.products = [];
      insuranceProductIds.forEach(id => {
        const { name } = productObject[id] || {};
        const { packs, amount } = insuranceProduct[id] || {};
        const temp = {};
        temp.productName = name;
        temp.packs = packs;
        temp.amount = amount;
        insuranceObject.products.push(temp);
      });
      insurance.push(insuranceObject);
    }
    for (const charityAppliedId of charityData) {
      const charityApplied = await CharityAppliedService.getContributionRequest(
        charityAppliedId
      );
      const {
        charityId,
        PO: { products: charityProducts = {} } = {}
      } = charityApplied;
      const charityDetail = await CharityService.getCharityById(charityId);
      const { name: charityName } = charityDetail;
      const charityObject = {};
      charityObject.charityName = charityName;
      let charityAmount = 0;

      charityObject.products = [];
      const charityProductIds = Object.keys(charityProducts);
      charityProductIds.forEach(id => {
        const { name } = productObject[id] || {};
        const { packs, amount } = charityProducts[id] || {};
        charityAmount += parseFloat(amount);
        const temp = {};
        temp.productName = name;
        temp.packs = packs;
        temp.amount = parseFloat(amount);
        charityObject.products.push(temp);
      });
      charityObject.amount = charityAmount;
      charityObject.percent = ((charityAmount / totalAmount) * 100).toFixed(2);
      charity.push(charityObject);
    }
    return { contribution: { oop, coPay, insurance, charity } };
  } catch (error) {
    console.log("error---------------------- :", error);
  }
};
