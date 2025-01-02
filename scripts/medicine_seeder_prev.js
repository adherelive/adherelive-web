// "use strict";

// import {TABLE_NAME} from "../models/medicines";

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.bulkInsert(TABLE_NAME, [
//       {
//         name: "acetaminophen 300 MG / codeine phosphate 30 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54862,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "valsartan 80 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57589,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{21 (ethinyl estradiol 0.03 MG / levonorgestrel 0.15 MG Oral Tablet) / 7 (inert ingredients 1 MG Oral Tablet) } Pack [Chateal 28 Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66720,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "FENOFIBRATE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7613,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Carvedilol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36477,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "simvastatin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54463,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "erythromycin stearate 250 MG Oral Tablet [Erythrocin Stearate]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20954,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amlodipine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56158,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ziprasidone 40 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 5641,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Citalopram 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31893,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ciprofloxacin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54327,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "misoprostol 0.2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10855,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Chlorthalidone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54558,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Ondansetron",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42500,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46372,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Nifedipine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59441,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR venlafaxine 75 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64725,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ENALAPRIL MALEATE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18263,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "benzonatate 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46835,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nortriptyline 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55524,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Losartan Potassium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61059,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Tamsulosin Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65523,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "allopurinol 300 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 5979,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "APAP 325 MG / hydrocodone bitartrate 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23988,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70110,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metronidazole 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54645,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Necon",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31981,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "EPZICOM",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50567,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "valacyclovir 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37546,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "glipizide 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34043,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66291,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Fluoxetine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59788,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Klor-Con Sprinkle",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53796,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "omeprazole 20 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4729,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.075 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53556,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Clonazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8500,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Doxycycline",
//         type: "tablet",
//         description: "",
//         pillbox_id: 13746,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14478,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Lorazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64810,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lithium carbonate 300 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61981,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "captopril 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38860,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Estradiol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 5589,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amoxicillin 875 MG / clavulanate 125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54435,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "carvedilol 6.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36799,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamotrigine 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22925,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Propranolol Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64720,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Amitriptyline Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 24095,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nateglinide 120 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22598,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "trazodone hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75711,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Hydrochlorothiazide 12.5 MG / Lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 51274,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Atenolol and Chlorthalidone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42772,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Trazodone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45350,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11758,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lisinopril",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44947,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acyclovir 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55607,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "mirtazapine 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55894,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Osmotic 24 HR nifedipine 60 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61669,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metronidazole 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1314,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62179,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76679,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "12 HR Oxycontin 60 MG Extended Release Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32371,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nortriptyline 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54961,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Amitriptyline Hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36842,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ethacrynic acid 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56696,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nadolol 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10007,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Terbinafine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57205,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 69093,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Naproxen Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41910,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Zolpidem tartrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16720,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57001,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Metformin Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62784,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "indomethacin 75 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59446,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "diclofenac sodium 75 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 28510,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62513,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "quetiapine 300 MG Oral Tablet [Seroquel]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23921,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atenolol 100 MG / chlorthalidone 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78400,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 325 MG / hydrocodone bitartrate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11870,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "DIGOX",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16532,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{21 (ethinyl estradiol 0.02 MG / norethindrone acetate 1 MG Oral Tablet) / 7 (ferrous fumarate 75 MG Oral Tablet) } Pack [Microgestin Fe 1/20 28 Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66962,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54460,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tacrolimus 5 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59135,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61853,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65778,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Potassium Chloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65873,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Glipizide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48504,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "potassium chloride 10 MEQ Extended Release Oral Tablet [Klor-Con]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 26689,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "glipizide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10030,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "FOSINOPRIL SODIUM",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7006,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "aripiprazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45063,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methocarbamol 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62986,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Dexamethasone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60885,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67283,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Glycopyrrolate 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14007,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64808,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naltrexone hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54567,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "promethazine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67186,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Famotidine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34499,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76724,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Trazodone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 40973,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amlodipine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 40926,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "eszopiclone 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53857,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Buprenorphine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59719,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamivudine 150 MG / zidovudine 300 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66115,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR Nifedipine 30 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12081,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "guanfacine 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46829,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Lorazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43438,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33356,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Effexor",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59563,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lovastatin 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64462,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG / lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77260,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Diazepam 5 MG Oral Tablet [Valium]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25515,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77454,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methimazole 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47525,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Pseudoephedrine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77468,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Montelukast Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60342,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Tacrolimus",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21555,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydroxyzine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61069,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Warfarin Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38074,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "citalopram 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39494,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methocarbamol 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64870,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR metoprolol succinate 50 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 24829,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Celecoxib",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59383,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sildenafil 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71347,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "buprenorphine 8 MG Sublingual Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71331,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77700,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "carvedilol 3.125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38844,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "buspirone hydrochloride 30 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72368,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Diltiazem Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49081,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "folic acid 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60770,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Morphine Sulfate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12021,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "dicyclomine hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53811,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66940,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65117,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71444,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sertraline 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71438,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "12 HR ranolazine 500 MG Extended Release Oral Tablet [Ranexa]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38031,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "zolpidem tartrate 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46885,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR divalproex sodium 500 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38207,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nadolol 80 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63751,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "nitrofurantoin, macrocrystals 25 MG / nitrofurantoin, monohydrate 75 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54697,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sulfamethoxazole 800 MG / trimethoprim 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76598,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen sodium 220 MG Oral Tablet [Aleve]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61245,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77730,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ondansetron 8 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54843,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Methocarbamol 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44057,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "rosuvastatin calcium 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78617,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Pravastatin Sodium 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1318,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR oxybutynin chloride 10 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78092,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44981,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78242,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8479,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ropinirole hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25356,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78307,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metformin hydrochloride 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78310,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78335,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoclopramide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78336,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78343,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78346,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "venlafaxine 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78358,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Abacavir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57660,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prochlorperazine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17310,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR guanfacine 1 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12608,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tramadol hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31606,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Sanctura XR 60 MG 24 HR Extended Release Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9758,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "carvedilol 6.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62445,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Cephalexin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36472,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "baclofen 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62015,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "benzonatate 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38186,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.112 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76356,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Nitrofurantion Macrocrystals",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57777,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "azithromycin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61486,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "propranolol hydrochloride 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78426,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63561,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Hydrochlorothiazide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56780,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{21 (ethinyl estradiol 0.02 MG / norethindrone acetate 1 MG Oral Tablet) / 7 (ferrous fumarate 75 MG Oral Tablet) } Pack",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78432,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Myorisan",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33999,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clonazepam 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78457,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "promethazine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78547,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "phentermine hydrochloride 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78460,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "imatinib 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60005,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamotrigine 5 MG Chewable Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56767,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Propranolol Hydrochloride 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1354,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "etodolac 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16443,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78554,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamotrigine 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78562,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "olanzapine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78553,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "alprazolam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78565,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Montelukast Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63131,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78564,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78575,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Trazodone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16511,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Topiramate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70721,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "aspirin 81 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 68624,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amlodipine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 101,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "labetalol hydrochloride 300 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64393,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levetiracetam 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62940,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17173,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meclizine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78736,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "escitalopram 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25610,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60564,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamotrigine 200 MG Oral Tablet [Lamictal]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32781,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55280,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Etodolac",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60262,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lamivudine 150 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56681,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "buspirone hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57742,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "terazosin 1 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31367,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55939,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Gabapentin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45005,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Clarithromycin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56368,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tadalafil 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71823,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.088 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50963,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydroxyzine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54166,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "oxybutynin chloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62336,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Biaxin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47094,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR glipizide 5 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71816,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "doxycycline hyclate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55434,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "temazepam 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62677,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "oxazepam 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58024,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73307,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Abacavir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55480,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Azithromycin Dihydrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56121,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clindamycin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56329,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Dificid",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58514,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "diethylpropion hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7785,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG / lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44234,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 300 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56980,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "simvastatin 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72700,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "duloxetine 20 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57255,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Verapamil hydrochloride 180 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6519,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Gabapentin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15228,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "olanzapine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54918,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Atorvastatin Calcium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 941,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Glipizide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 343,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Trimethobenzamide Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8256,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ziprasidone 60 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54029,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65010,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atorvastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52973,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Lorazepam 1 MG Oral Tablet [Ativan]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19601,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meclizine hydrochloride 25 MG Chewable Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52349,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "benazepril hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63018,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amoxicillin 875 MG / clavulanate 125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15178,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meloxicam 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23962,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "omega-3 acid ethyl esters (USP) 1000 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53580,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Ibuprofen",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16451,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Amoxicillin and Clavulanate Potassium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59801,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "hydrochlorothiazide 12.5 MG / losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75152,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.075 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70398,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sertraline 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55051,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Lisinopril",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17088,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amitriptyline hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70155,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Amitriptyline Hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48344,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Clarithromycin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64417,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydralazine hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70556,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "valacyclovir 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66304,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sennosides, USP 8.6 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21460,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70384,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "HCTZ 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12927,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "modafinil 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70600,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "folic acid 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71932,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Potassium Chloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11700,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54856,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levofloxacin 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30922,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "selegiline hydrochloride 5 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34690,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methocarbamol 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70593,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "AMLODIPINE BESYLATE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70602,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Cilostazol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22228,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "indomethacin 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38876,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "acetaminophen 500 MG / diphenhydramine hydrochloride 25 MG Oral Tablet [Tylenol PM]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75204,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55173,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clonidine hydrochloride 0.2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 475,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 500 MG Oral Tablet [Tylenol]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75203,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amitriptyline hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56282,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "haloperidol 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56093,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clozapine 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65869,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clonidine hydrochloride 0.1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22045,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "warfarin sodium 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71993,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 300 MG / codeine phosphate 30 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59467,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75792,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metformin hydrochloride 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65986,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "aspirin 325 MG / chlorpheniramine maleate 2 MG / phenylephrine bitartrate 7.8 MG Effervescent Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75385,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "acetaminophen 500 MG / caffeine 60 MG / pyrilamine maleate 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75389,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meloxicam 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43356,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clonazepam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64741,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Chlorpromazine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50278,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76487,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydromorphone hydrochloride 8 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45949,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "alendronic acid 35 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56570,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tizanidine 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57006,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "omeprazole 40 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58486,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nortriptyline 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59320,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR venlafaxine 150 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76575,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Metformin Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55553,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "{6 (azithromycin 250 MG Oral Tablet) } Pack",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58253,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "fluoxetine 20 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62956,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56943,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "alprazolam 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54409,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acyclovir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65815,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sertraline 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76414,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "paroxetine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70426,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "omeprazole 20 MG Delayed Release Oral Tablet [Prilosec]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75384,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "citalopram 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54791,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atorvastatin 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73087,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG / valsartan 320 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59678,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR Bupropion Hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22838,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ursodiol 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75603,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "diclofenac sodium 75 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70763,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54975,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG / valsartan 320 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67089,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "atropine sulfate 0.025 MG / diphenoxylate hydrochloride 2.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44295,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "loratadine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52431,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55837,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73701,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lovastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37658,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "diazepam 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71076,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metformin hydrochloride 850 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 51702,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "Microencapsulated potassium chloride 10 MEQ Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76419,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Benazepril Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17745,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{21 (ethinyl estradiol 0.02 MG / levonorgestrel 0.1 MG Oral Tablet) / 7 (inert ingredients 1 MG Oral Tablet) } Pack [Orsythia 28 Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67195,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "zolpidem tartrate 6.25 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61697,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "potassium chloride 10 MEQ Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9554,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{21 (ethinyl estradiol 0.02 MG / norethindrone acetate 1 MG Oral Tablet) / 7 (ferrous fumarate 75 MG Oral Tablet) } Pack [Junel Fe 1/20 28 Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56773,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sulfasalazine 500 MG Oral Tablet [Sulfazine]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6311,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nabumetone 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72050,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Bethanechol Chloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17338,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cephalexin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76608,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "celecoxib 200 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65264,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "montelukast 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61734,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "dicyclomine hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71423,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "valacyclovir hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50929,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "12 HR bupropion hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77264,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metronidazole 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62397,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "enalapril maleate 10 MG / hydrochlorothiazide 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63195,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "duloxetine 60 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66070,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Diuscreen Multi-Drug Medicated Test Kit",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3539,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Cyclobenzaprine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48648,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Indomethacin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56409,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67354,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "dapsone 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77937,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 400 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76551,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "dutasteride 0.5 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75635,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "propranolol hydrochloride 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72986,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "Dextroamphetamine Saccharate, Amphetamine Aspartate Monohydrate, Dextroamphetamine Sulfate and Amphetamine Sulfate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31543,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "torsemide 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76251,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 25 MG / triamterene 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31980,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 20 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77113,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "fenofibrate 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76995,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Tri-Mili",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74617,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tizanidine 6 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77275,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "benazepril hydrochloride 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76621,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levocetirizine dihydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75620,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metformin hydrochloride 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75627,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "dimenhydrinate 50 MG Oral Tablet [Dramamine]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52151,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59721,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 200 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75668,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "{7 (ethinyl estradiol 0.025 MG / norgestimate 0.18 MG Oral Tablet) / 7 (ethinyl estradiol 0.025 MG / norgestimate 0.215 MG Oral Tablet) / 7 (ethinyl estradiol 0.025 MG / norgestimate 0.25 MG Oral Tablet) / 7 (inert ingredients 1 MG Oral Tablet) } Pack [Tri-Lo-Sprintec 28 Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75658,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "temazepam 15 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56978,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "zolpidem tartrate 6.25 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75703,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78058,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hyoscyamine sulfate 0.125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76040,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "hydrochlorothiazide 25 MG / losartan potassium 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75734,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "fenofibrate 200 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65493,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "mirtazapine 45 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75732,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "sertraline 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75743,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Promethazine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33786,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 325 MG / hydrocodone bitartrate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75728,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19700,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75742,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "phenazopyridine hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78088,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Sulindac",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3365,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "NP Thyroid 90",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57981,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Losartan Potassium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61057,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "metoprolol tartrate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 184,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR verapamil hydrochloride 100 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75787,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lorazepam 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63912,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 50 MG Oral Capsule [Lyrica]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16478,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Ketorolac Tromethamine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22096,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methylergonovine maleate 0.2 MG Oral Tablet [Methergine]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9695,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nabumetone 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59330,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "RISPERIDONE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71452,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cefadroxil 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75897,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76705,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prasugrel 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75964,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75909,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "trazodone hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61821,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "potassium chloride 10 MEQ Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75973,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "doxepin hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75984,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "aripiprazole 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74410,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atorvastatin 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14991,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tadalafil 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76067,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 20 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76035,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "carisoprodol 350 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76139,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "cephalexin 250 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76094,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41617,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nitrofurantoin, macrocrystals 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57903,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "calcitriol 0.00025 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45387,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "alprazolam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 2891,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lisinopril 20 MG Oral Tablet [Zestril]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43232,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76185,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4233,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pioglitazone 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76209,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Bethanechol Chloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12028,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Theophylline",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3804,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "trimethobenzamide hydrochloride 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76203,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 375 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56517,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "doxazosin 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76224,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "phentermine hydrochloride 15 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76238,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76708,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "hydrochlorothiazide 25 MG / olmesartan medoxomil 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76223,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "paroxetine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76219,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38597,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "spironolactone 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76235,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tramadol hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76236,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "carisoprodol 350 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76243,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atorvastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76232,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "bupropion hydrochloride 75 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76244,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79897,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72983,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "glipizide 2.5 MG / metformin hydrochloride 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76253,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "24 HR paliperidone 3 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76252,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "diazepam 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76270,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "furosemide 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76306,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 150 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76451,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "aripiprazole 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79920,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amoxicillin 875 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65164,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "clindamycin 150 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76479,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meloxicam 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79935,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "phentermine hydrochloride 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9031,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "famotidine 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76563,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ciprofloxacin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55305,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "phenobarbital 97.2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78727,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "pregabalin 225 MG Oral Capsule [Lyrica]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59200,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "fenofibrate 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76571,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tizanidine 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76604,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meclizine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54537,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ciprofloxacin 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76614,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Zolpidem Tartrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10440,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Nortriptyline Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3079,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74649,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Levothyroxine Sodium 0.1 MG Oral Tablet [Levoxyl]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33295,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "anastrozole 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 80046,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76650,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "trazodone hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76651,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nabumetone 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76709,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "APAP 500 MG / oxycodone hydrochloride 5 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19329,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "quetiapine fumarate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 259,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Docusate Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42849,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "indomethacin 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14408,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Eszopiclone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61612,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Pantoprazole Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18345,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "bumetanide 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 80109,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "gabapentin 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63393,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "levothyroxine sodium 0.137 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34969,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "oxcarbazepine 150 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7159,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Kadian",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46785,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "simvastatin 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33304,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ibuprofen 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76662,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "topiramate 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74664,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Potassium Chloride 10 MEQ Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3404,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amitriptyline hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76671,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "buspirone hydrochloride 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76672,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR diltiazem hydrochloride 120 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30381,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "prednisone 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58392,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "tizanidine 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9355,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "acetaminophen 300 MG / codeine phosphate 30 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64856,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Aggrenox",
//         type: "tablet",
//         description: "",
//         pillbox_id: 28097,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "naproxen 375 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 80201,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41456,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "furosemide 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 2648,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "famotidine 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62871,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR amphetamine aspartate 2.5 MG / amphetamine sulfate 2.5 MG / dextroamphetamine saccharate 2.5 MG / dextroamphetamine sulfate 2.5 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59386,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Amlodipine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49659,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Bisacodyl",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17362,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methocarbamol 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76720,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "temazepam 15 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46888,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Chlorpromazine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49689,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "disopyramide 150 MG Oral Capsule [Norpace]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11014,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ampicillin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76718,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "zolpidem tartrate 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14906,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "glipizide 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46681,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "furosemide 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32346,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "ergoloid mesylates, USP 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3623,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "12 HR ranolazine 500 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77215,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name:
//           "24 HR diltiazem hydrochloride 120 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65194,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "midodrine hydrochloride 2.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76733,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "nortriptyline 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12931,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "allopurinol 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7698,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "amoxicillin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4926,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "meloxicam 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16245,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "aripiprazole 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57240,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "mesalamine 400 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76737,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Pyrazinamide 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3185,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Triamterene and Hydrochlorothiazide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32737,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "12 HR orphenadrine citrate 100 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76778,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "glimepiride 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23837,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "hydrochlorothiazide 25 MG / valsartan 320 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31839,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "lisinopril",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39231,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "Glipizide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47044,
//         created_at: "2020-07-15 12:05:21",
//         updated_at: "2020-07-15 12:05:21"
//       },
//       {
//         name: "methocarbamol 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76746,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Atenolol 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3906,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "baclofen 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72165,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quetiapine 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72155,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fexofenadine hydrochloride 180 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75558,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothyroxine Sodium 0.075 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37635,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Endocet 5/325 Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 29538,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fenoprofen 400 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72166,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amitriptyline hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49960,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicyclomine hydrochloride 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70410,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonazepam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61920,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levothyroxine sodium 0.1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76785,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "simvastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15310,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "furosemide 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 27008,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 40649,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "naproxen 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50423,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metformin hydrochloride 850 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76783,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ropinirole 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53723,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pantoprazole 20 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76848,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothyroxine Sodium 0.125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17888,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Amnesteem",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16888,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "alprazolam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8882,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "chlorpheniramine maleate 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52548,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8722,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Etodolac",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47400,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR quetiapine 200 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76852,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sucralfate 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6527,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Loratadine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32919,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Warfarin Sodium 2 MG Oral Tablet [Coumadin]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16976,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Vicodin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 29852,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acyclovir 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71322,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "alprazolam 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38576,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metronidazole 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6071,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Doxycycline Hyclate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 35491,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "folic acid 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56323,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "bumetanide 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73030,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Naproxen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44487,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "olanzapine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57256,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "trazodone hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1545,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet [Deltasone]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72237,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "potassium chloride 10 MEQ Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76911,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pramipexole dihydrochloride 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76913,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Enalapril Maleate 10 MG / Hydrochlorothiazide 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7233,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "buspirone hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47510,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "FEMCON Fe",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15184,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Doxazosin 8 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37525,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Captopril",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53623,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "moxifloxacin 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73623,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Metformin hydrochloride 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12104,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "alendronic acid 35 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74101,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clarithromycin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73210,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "omeprazole 40 MG Delayed Release Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15445,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Zolpidem Tartrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20168,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "acetaminophen 325 MG / butalbital 50 MG / caffeine 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61503,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "penicillin V potassium 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49250,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diclofenac sodium 50 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10964,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Venlafaxine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 5648,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34177,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "tadalafil 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70328,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acyclovir 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76965,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33715,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47361,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "indomethacin 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47668,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diethylpropion hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57289,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77020,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ondansetron 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77021,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "propranolol hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77081,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "donepezil hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77065,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clopidogrel 75 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77060,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxepin hydrochloride 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77100,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "oxcarbazepine 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56465,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "aspirin 81 MG Delayed Release Oral Tablet [Aspir-Low]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59034,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR quetiapine 300 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77306,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR metoprolol succinate 25 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73456,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sertraline 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59485,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "methylphenidate hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45763,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ketorolac Tromethamine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 51111,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75104,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "paroxetine hydrochloride 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66676,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "tadalafil 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73426,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acetaminophen 325 MG / hydrocodone bitartrate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57089,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "docusate sodium 50 MG / sennosides, USP 8.6 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 69690,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicyclomine hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62467,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "olanzapine 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12136,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "nizatidine 150 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12444,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56053,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR venlafaxine 75 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73588,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ACETAMINOPHEN AND CODEINE PHOSPHATE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 29874,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 20 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16638,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 300 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65999,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "nifedipine 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73254,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hyoscyamine Sulfate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17969,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "aspirin 325 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58727,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ranitidine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54913,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "TAMSULOSIN HYDROCHLORIDE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34932,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cefuroxime 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71848,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diltiazem hydrochloride 60 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71933,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "calcium acetate 667 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71954,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levofloxacin 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64315,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "isosorbide dinitrate 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72754,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydroxyzine pamoate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48025,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR nifedipine 30 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38403,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR propranolol hydrochloride 120 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71989,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71970,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "meloxicam 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72018,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Methimazole 10 MG Oral Tablet [Tapazole]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 13531,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Carvedilol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31951,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Temazepam 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23089,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Dilaudid 8 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37043,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72089,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 2.5 MG / benazepril hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72198,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "doxycycline hyclate 150 MG Delayed Release Oral Tablet [Soloxide]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63752,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metoclopramide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67115,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54717,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levetiracetam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52390,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "topiramate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72285,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxepin hydrochloride 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6601,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quetiapine 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67016,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72357,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benztropine mesylate 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72367,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Amlodipine 10 MG / valsartan 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17056,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amitriptyline hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72328,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levothyroxine sodium 0.175 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70388,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "esomeprazole 20 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72379,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 20 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71280,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "etodolac 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42800,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "minocycline 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72478,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Clopidogrel",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48249,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amoxicillin 250 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60020,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "nifedipine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38132,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benazepril hydrochloride 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72418,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicyclomine hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72446,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pravastatin sodium 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71405,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pramipexole dihydrochloride 0.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 27847,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 40 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72517,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "nabumetone 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30949,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levofloxacin 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63773,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "enalapril maleate 2.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72457,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sudafed 12 Hour",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60358,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 2.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66376,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diazepam 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4036,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "gabapentin 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50064,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cephalexin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67042,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Minocycline Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55396,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxycycline hyclate 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72550,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pravastatin sodium 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72576,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Citalopram 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39568,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "methocarbamol 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4600,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "olanzapine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78752,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydrochlorothiazide 25 MG / valsartan 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78753,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amoxicillin 875 MG / clavulanate 125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63020,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ziprasidone 80 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7670,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Nortriptyline Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41231,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fexofenadine hydrochloride 180 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78768,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "furosemide 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34062,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "carisoprodol 350 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78785,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Doxycycline Hyclate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22769,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clindamycin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78787,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Isosorbide Dinitrate 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36436,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Temazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78763,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "escitalopram 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78767,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ergocalciferol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78773,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicyclomine hydrochloride 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78793,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "phentermine hydrochloride 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4071,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "venlafaxine 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78808,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "montelukast 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33824,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Naproxen Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18942,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quinapril 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78814,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Tekturna HCT",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20286,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Butalbital, Acetaminophen and Caffeine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41428,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levothyroxine sodium 0.025 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78819,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "trazodone hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78823,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 5 MG / benazepril hydrochloride 20 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78801,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR metoprolol succinate 100 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4906,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "trazodone hydrochloride 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78855,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amoxicillin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59347,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atorvastatin 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78861,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acetaminophen 325 MG / hydrocodone bitartrate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78869,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "phenobarbital 16.2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77285,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cefadroxil 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1742,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diclofenac potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11135,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79789,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "omeprazole 20 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62060,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amoxicillin 250 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73497,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ropinirole 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74704,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "spironolactone 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74483,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Warfarin Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31750,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Verapamil Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39976,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "citalopram 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4640,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lubiprostone 0.024 MG Oral Capsule [Amitiza]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 2601,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "colestipol hydrochloride 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44380,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1177,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "chlorpromazine hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79972,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "TRAMADOL HYDROCHLORIDE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 24266,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Tizanidine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55550,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fosinopril sodium 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55650,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Clonazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33704,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sumatriptan 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 80111,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Latuda",
//         type: "tablet",
//         description: "",
//         pillbox_id: 27752,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Methocarbamol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4033,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Lorazepam 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16974,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atorvastatin 80 MG Oral Tablet [Lipitor]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31703,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydrochlorothiazide 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43454,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "estrogens, conjugated (USP) 0.625 MG Oral Tablet [Premarin]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12804,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "simvastatin 80 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56163,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "FLUOXETINE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54969,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cipro 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 26390,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Clindamycin 150 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 2733,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pantoprazole 40 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78164,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Pyrazinamide 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 2862,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levothyroxine sodium 0.05 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8195,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "stavudine 20 MG Oral Capsule [Zerit]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8467,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Calcitriol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54944,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cilostazol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33531,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonidine hydrochloride 0.1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73869,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Losartan Potassium 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39819,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Atenolol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61819,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Valacyclovir hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59373,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sertraline 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59824,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sulfasalazine 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71565,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxycycline hyclate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31731,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxazosin 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43439,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "promethazine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76822,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "albuterol sulfate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19804,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "AMOXICILLIN AND CLAVULANATE POTASSIUM",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39653,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Skelaxin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 9476,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "oxaprozin 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50926,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "montelukast sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 157,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fluphenazine hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55128,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicyclomine hydrochloride 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 58174,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Mirtazapine 15 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19681,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "carvedilol 6.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7823,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lorazepam 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64599,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Glipizide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14653,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Divalproex Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48628,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "eszopiclone 3 MG Oral Tablet [Lunesta]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8371,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hydrocodone Bitartrate and Acetaminophen",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11552,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hydrochlorothiazide 25 MG / Lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41598,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "prednisone 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72394,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "phenobarbital 32.4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 77286,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "montelukast 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66039,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "meloxicam 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30943,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fexofenadine hydrochloride 180 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 68654,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fexmid",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17776,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Metoprolol Tartrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 28138,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cephalexin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57183,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "HYDROCODONE BITARTRATE AND ACETAMINOPHEN",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10043,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Nifedipine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57530,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sildenafil 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20258,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Glyburide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 26561,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "methocarbamol 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17641,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Amitriptyline Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6831,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Naproxen",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38424,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fosinopril Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3206,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluphenazine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 31221,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Diphenhydramine Hydrochloride 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34610,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "oxybutynin chloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10874,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "enalapril maleate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46547,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Valproic Acid",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20513,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sotalol hydrochloride 80 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18374,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "DILAUDID",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54299,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "terbinafine 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73370,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR levetiracetam 750 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1061,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 2.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56806,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "prednisone 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42514,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levofloxacin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50130,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benztropine mesylate 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 3040,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "spironolactone 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14874,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Acyclovir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10048,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "SERTRALINE HYDROCHLORIDE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 23668,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56155,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sennosides, USP 8.6 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75368,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Donnatal",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45221,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Chlordiazepoxide Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54564,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "voriconazole 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59431,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73363,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metformin hydrochloride 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39282,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pseudoephedrine hydrochloride 60 MG Oral Tablet [Sudogest]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 26096,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Benazepril Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57233,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "methylprednisolone 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 35947,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cytotec",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21354,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Metformin Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32905,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lansoprazole 15 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61177,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ISOSORBIDE DINITRATE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11842,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "baclofen 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 40591,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dicloxacillin 500 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46290,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benzonatate 200 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63842,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "simvastatin 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7227,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dimenhydrinate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47273,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "risperidone 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17342,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fluconazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44987,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "zolpidem tartrate 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36997,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Citalopram",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55711,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "gabapentin 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76557,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "rifabutin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59785,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1276,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clopidogrel 75 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1382,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "phentermine hydrochloride 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34915,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Acetaminophen 325 MG / Hydrocodone Bitartrate 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41818,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36500,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "divalproex sodium 250 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48519,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sulfamethoxazole 800 MG / trimethoprim 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4747,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cycloserine 250 MG Oral Capsule [Seromycin]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 26034,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diclofenac sodium 75 MG Delayed Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15397,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "NABUMETONE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16890,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "venlafaxine 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 22231,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "phentermine hydrochloride 30 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71233,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Mucinex D",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18604,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "gabapentin 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43687,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydrochlorothiazide 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30666,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metoprolol tartrate 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65134,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levofloxacin 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55625,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Clonidine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38804,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sumatriptan 100 MG Oral Tablet [Imitrex]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39431,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fluconazole 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 29111,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hydrocodone Bitartrate and Acetaminophen",
//         type: "tablet",
//         description: "",
//         pillbox_id: 38479,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cephalexin 250 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44207,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "isosorbide dinitrate 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7520,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1006,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pramipexole dihydrochloride 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36938,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR metformin hydrochloride 500 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62827,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8374,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63796,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "baclofen 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75715,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ciprofloxacin 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65516,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "simvastatin 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21769,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Verapamil hydrochloride 240 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11888,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR diclofenac sodium 100 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73072,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acyclovir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15300,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothyroxine Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37175,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metoprolol tartrate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17680,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "naproxen sodium 220 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 68557,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Omeprazole 20 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11157,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Prednisone 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14289,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Temazepam",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45988,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atorvastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41908,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "duloxetine 60 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7582,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Aripiprazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25012,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Acyclovir",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10239,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "levothyroxine sodium 0.125 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73654,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54126,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Topiramate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25171,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Clomiphene Citrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54572,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR metformin hydrochloride 750 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73617,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "glimepiride 4 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 7384,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR Isosorbide Mononitrate 30 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37083,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73685,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothroid 0.05 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30627,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "solifenacin succinate 5 MG Oral Tablet [Vesicare]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73670,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "temazepam 15 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66704,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "telmisartan 80 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64195,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydroxyzine pamoate 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33091,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "acetaminophen 325 MG / tramadol hydrochloride 37.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21031,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Glipizide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56296,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Trazodone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1263,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lovastatin 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56324,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Metformin hydrochloride 1000 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 27656,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ziprasidone hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 41075,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR bupropion hydrochloride 150 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45084,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Prochlorperazine Maleate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55001,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonazepam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 48906,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "duloxetine 30 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21974,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hydrochlorothiazide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 51236,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "potassium chloride 8 MEQ Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14078,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "topiramate 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72563,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "colesevelam hydrochloride 625 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65513,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonidine hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64268,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metronidazole 250 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 17236,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonidine hydrochloride 0.1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71896,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "rizatriptan 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11281,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Phenobarbital",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50227,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sildenafil",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56249,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "LORAZEPAM",
//         type: "tablet",
//         description: "",
//         pillbox_id: 29808,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "minocycline 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66190,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diazepam 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73353,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "24 HR isosorbide mononitrate 30 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10571,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "AMRIX",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1310,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fenofibrate 160 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74216,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Dexamethasone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39518,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sulfamethoxazole and Trimethoprim",
//         type: "tablet",
//         description: "",
//         pillbox_id: 507,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acyclovir 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78200,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cyclobenzaprine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45128,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Appbutamone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 33472,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Pyrazinamide 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44440,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothyroxine Sodium 0.025 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 5816,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "gabapentin 600 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74297,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "terazosin 2 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44006,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ARIPIPRAZOLE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64199,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Theraproxen-90",
//         type: "tablet",
//         description: "",
//         pillbox_id: 32860,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Levothyroxine Sodium",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59260,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Valacyclovir Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66584,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "escitalopram 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53961,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "alprazolam 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71099,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Imipramine Pamoate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55580,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ergocalciferol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64937,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Risperidone 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8399,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluoxetine 10 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63114,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "dexamethasone 1.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 4694,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "morphine sulfate 60 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 63913,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "glyBURIDE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65309,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cymbalta",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25120,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "topiramate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 27811,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR propranolol hydrochloride 160 MG Extended Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30394,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "tramadol hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55385,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 46209,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "alprazolam 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78922,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Cyclobenzaprine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 50159,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diphenhydramine hydrochloride 25 MG Oral Capsule [Diphenhist]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 68509,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pseudoephedrine hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49455,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atorvastatin 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54262,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydroxyzine hydrochloride 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62694,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Regular Strength Enteric coated aspirin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1471,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ketoconazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66266,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acetaminophen 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 69374,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "sumatriptan 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74453,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "gabapentin 100 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64699,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Phentermine Hydrochloride 15 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34998,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Sertraline 100 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20610,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quetiapine 400 MG Oral Tablet [Seroquel]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 14950,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 36549,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "atenolol 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74480,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "meloxicam 7.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 66478,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "indomethacin 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78226,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quetiapine 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 8579,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benazepril hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79032,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fluconazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34252,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53732,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR metformin hydrochloride 500 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 73644,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Therabenzaprine-90",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43033,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Doxycycline Hyclate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 25879,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cyclobenzaprine hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 16265,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "{7 (ethinyl estradiol 0.025 MG / norgestimate 0.18 MG Oral Tablet) / 7 (ethinyl estradiol 0.025 MG / norgestimate 0.215 MG Oral Tablet) / 7 (ethinyl estradiol 0.025 MG / norgestimate 0.25 MG Oral Tablet) / 7 (inert ingredients 1 MG Oral Tablet) } Pack [Tri-Lo-Marzia 28-Day]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57936,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acetaminophen 325 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79064,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Aripiprazole",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64487,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "OxyContin",
//         type: "tablet",
//         description: "",
//         pillbox_id: 19688,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 54978,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "prednisone 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 1107,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Zolpidem Tartrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21790,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "glipizide 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 70158,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pravastatin sodium 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74503,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metformin hydrochloride 850 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6335,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Lamivudine",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55300,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metoprolol tartrate 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62357,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lamotrigine 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 44010,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "acyclovir 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 78225,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "chlorthalidone 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62273,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benazepril hydrochloride 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59511,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "benztropine mesylate 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 74544,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "clonidine hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 20362,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "DPH sodium 100 MG Extended Release Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 21138,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Ibuprofen 800 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 6757,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR Loratadine 10 MG / Pseudoephedrine sulfate 240 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10696,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "buspirone hydrochloride 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 55677,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxepin hydrochloride 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72534,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "metformin hydrochloride 850 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56511,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "oxycodone hydrochloride 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79083,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "quinapril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 42207,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Hydrochlorothiazide 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37711,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Spironolactone",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45968,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "carvedilol 12.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34554,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Oxycodone and Acetaminophen",
//         type: "tablet",
//         description: "",
//         pillbox_id: 35427,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR tramadol hydrochloride 200 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72572,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "allopurinol 300 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 49151,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "terazosin 1 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 13567,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "hydrochlorothiazide 12.5 MG / losartan potassium 50 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12479,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Buspirone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30450,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Gabazolamine-0.5",
//         type: "tablet",
//         description: "",
//         pillbox_id: 18520,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "TRAMADOL HYDROCHLORIDE",
//         type: "tablet",
//         description: "",
//         pillbox_id: 43318,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 200 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 52148,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fosamprenavir 700 MG Oral Tablet [Lexiva]",
//         type: "tablet",
//         description: "",
//         pillbox_id: 15342,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "valganciclovir 450 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72208,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "fluconazole 150 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 65612,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lisinopril 5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 53713,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "doxazosin 2 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 37848,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Calcitriol",
//         type: "tablet",
//         description: "",
//         pillbox_id: 57783,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Venlafaxine Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 11652,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "promethazine hydrochloride 12.5 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76535,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fenofibrate",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47230,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "naproxen sodium 220 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 61216,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Fosinopril Sodium and Hydrochlorothiazide",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12340,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "methocarbamol 750 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 47505,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "furosemide 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72551,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "loratadine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 79223,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "valacyclovir 500 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 72830,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "tamsulosin hydrochloride 0.4 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 39475,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydrochlorothiazide 12.5 MG / lisinopril 20 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 51640,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "diphenhydramine hydrochloride 25 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 67636,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "hydroxyzine hydrochloride 25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56698,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Oxycodone Hydrochloride",
//         type: "tablet",
//         description: "",
//         pillbox_id: 10328,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "pregabalin 75 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75664,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name:
//           "24 HR isosorbide mononitrate 120 MG Extended Release Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 45714,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "ibuprofen 400 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 64774,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "naproxen 375 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 62584,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "Risperidone 0.25 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 12376,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "cefdinir 300 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 60956,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "lovastatin 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 30810,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "folic acid 1 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 34540,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "indomethacin 50 MG Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 59499,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "furosemide 40 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 56482,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "citalopram 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 71665,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "amlodipine 10 MG Oral Tablet",
//         type: "tablet",
//         description: "",
//         pillbox_id: 75678,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       },
//       {
//         name: "omeprazole 40 MG Delayed Release Oral Capsule",
//         type: "tablet",
//         description: "",
//         pillbox_id: 76166,
//         created_at: "2020-07-15 12:05:22",
//         updated_at: "2020-07-15 12:05:22"
//       }
//     ]);
//   },

//   down: (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete(TABLE_NAME, null, {});
//   }
// };
