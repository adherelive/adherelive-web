const programKeyValue = require("../models/programKeyValue");
const Mongo = require("../../libs/mongo");
var ObjectId = require("mongodb").ObjectID;
const { ABI_TEST, SomeXYZTest } = require("../testTemplates");

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    const options = [
      {
        _id: "333330303030303030303037",
        programId: "333330303030303030303030",
        values: {
          benefitDocuments: [
            ObjectId("777770303030303030303037"),
            ObjectId("777780303030303030303037"),
            ObjectId("777790303030303030303037")
          ],
          segmentationCategories: [
            "Demanding",
            "Dependent",
            "Denying",
            "Non Coping"
          ],
          educationCategories: [
            "Completed",
            "Reinforcement Needed",
            "Rejected",
            "Not done"
          ],
          riskCategories: ["Low Risk", "High Risk", "Not applicable"],
          stage: {
            list: ["fish_test", "ramp_up", "maintenance"],
            type: {
              fish_test: {
                id: "fish_test",
                name: "Fish Test",
                consent_required: true,
                is_medication_reminder_available: false
              },
              ramp_up: {
                id: "ramp_up",
                name: "Ramp Up",
                consent_required: true,
                is_medication_reminder_available: true
              },
              maintenance: {
                id: "maintenance",
                name: "Maintenance",
                consent_required: true,
                is_medication_reminder_available: true
              }
            }
          },
          dropOutReasons: {
            causality: [
              "economic",
              "patient",
              "physician",
              "funder",
              "medical"
            ],
            reasons: {
              economic: {
                id: "economic",
                name: "Economic Related",
                reasons: [
                  "Unemployed",
                  "Change of Job",
                  "Cost(unable to afford Medication out of pocket)",
                  "Unclear reasons",
                  "Other"
                ]
              },
              patient: {
                id: "patient",
                name: "Patient Related",
                reasons: [
                  "Patient doesn't want to start Rx (Fear of Side Effects)",
                  "Patient hasn't seen Dr. to renew Rx",
                  "Relocation/Leave Country",
                  "Patient doesn't want PSP",
                  "Patient decides to stop treatment",
                  "Patient takes 2nd HCP opinion",
                  "Patient doesn't want to reveal reasons",
                  "Distance/commuting difficulties",
                  "Other"
                ]
              },
              physician: {
                id: "physician",
                name: "Physian Related",
                reasons: [
                  "Remission",
                  "Switch to an alternative treatment",
                  "Stop treatment",
                  "Refill issue (hospital/pharmacy stock rupture, etc…)",
                  "Misdiagnosis",
                  "Other"
                ]
              },
              funder: {
                id: "funder",
                name: "Funder Related",
                reasons: [
                  "Funder declines treatment and approved another",
                  "Insurance Coverage",
                  "Administritive bureaucracy/documentation issues/ delay of renewal",
                  "Other"
                ]
              },
              medical: {
                id: "medical",
                name: "Medical Related",
                reasons: [
                  "Side Effects/AE",
                  "Loss of Response",
                  "Lack of Response",
                  "Hospitalization",
                  "Pregnancy",
                  "Infections",
                  "Co-morbidities",
                  "Death",
                  "Not eligible",
                  "Other"
                ]
              }
            }
          },
          test: {
            list: ["fish_test", "baseline"],
            type: {
              fish_test: {
                id: "fish_test",
                name: "Fish test",
                field_ids: ["date", "voucher_no", "result", "lab"],
                fields: {
                  date: {
                    id: "date",
                    name: "Date",
                    type: "date",
                    format: ""
                  },
                  voucher_no: {
                    id: "voucher_no",
                    name: "Voucher No.",
                    type: "input",
                    placeholder: ""
                  },
                  result: {
                    id: "result",
                    name: "Result",
                    type: "radio",
                    options: [
                      {
                        id: "positive",
                        name: "Positive",
                        value: "Positive"
                      },
                      {
                        id: "negative",
                        name: "Negative",
                        value: "Negative"
                      }
                    ]
                  },
                  lab: {
                    id: "lab",
                    name: "Lab",
                    type: "input",
                    placeholder: ""
                  }
                }
              },
              baseline: {
                id: "baseline",
                name: "Baseline Laboratory test",
                field_ids: ["date", "result", "lab"],
                fields: {
                  date: {
                    id: "date",
                    name: "Date",
                    type: "date",
                    format: ""
                  },
                  result: {
                    id: "result",
                    name: "Result",
                    type: "input",
                    placeholder: ""
                  },
                  lab: {
                    id: "lab",
                    name: "Lab",
                    type: "input",
                    placeholder: ""
                  }
                }
              }
            }
          }
        }
      },
      {
        _id: "223330303030303030303039",
        programId: "223330303030303030303030",
        values: {
          test: {},
          stage: {
            list: ["fish_test", "ramp_up", "maintenance"],
            type: {
              fish_test: {
                id: "fish_test",
                name: "Fish Test",
                consent_required: true,
                is_medication_reminder_available: false
              },
              ramp_up: {
                id: "ramp_up",
                name: "Ramp Up",
                consent_required: true,
                is_medication_reminder_available: true
              },
              maintenance: {
                id: "maintenance",
                name: "Maintenance",
                consent_required: true,
                is_medication_reminder_available: true
              }
            }
          }
        }
      },
      {
        _id: "333220303030303030303038",
        programId: "333220303030303030303030",
        values: {
          test: {
            list: ["fish_test", "baseline"],
            type: {
              fish_test: {
                id: "fish_test",
                name: "Fish test",
                field_ids: ["date", "voucher_no", "result", "lab"],
                fields: {
                  date: {
                    id: "date",
                    name: "Date",
                    type: "date",
                    format: "LL"
                  },
                  voucher_no: {
                    id: "voucher_no",
                    name: "Voucher No.",
                    type: "input",
                    placeholder: ""
                  },
                  result: {
                    id: "result",
                    name: "Result",
                    type: "radio",
                    options: [
                      {
                        id: "positive",
                        name: "Positive",
                        value: "Positive"
                      },
                      {
                        id: "negative",
                        name: "Negative",
                        value: "Negative"
                      }
                    ]
                  },
                  lab: {
                    id: "lab",
                    name: "Lab",
                    type: "input",
                    placeholder: ""
                  }
                }
              },
              baseline: {
                id: "baseline",
                name: "Baseline Laboratory test",
                field_ids: ["date", "result", "lab"],
                fields: {
                  date: {
                    id: "date",
                    name: "Date",
                    type: "date",
                    format: "LL"
                  },
                  result: {
                    id: "result",
                    name: "Result",
                    type: "input",
                    placeholder: ""
                  },
                  lab: {
                    id: "lab",
                    name: "Lab",
                    type: "input",
                    placeholder: ""
                  }
                }
              }
            }
          },
          stage: {
            list: ["fish_test", "ramp_up", "maintenance"],
            type: {
              fish_test: {
                id: "fish_test",
                name: "Fish Test",
                consent_required: true,
                is_medication_reminder_available: false
              },
              ramp_up: {
                id: "ramp_up",
                name: "Ramp Up",
                consent_required: true,
                is_medication_reminder_available: true
              },
              maintenance: {
                id: "maintenance",
                name: "Maintenance",
                consent_required: true,
                is_medication_reminder_available: true
              }
            }
          }
        }
      }
    ];

    await programKeyValue.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await programKeyValue.create(options[i]);
      console.log("status", status);
    }
    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
