import Controller from "../";
import Logger from "../../../libs/log";

// SERVICES
import SymptomService from "../../services/symptom/symptom.service";
// import DocumentService from "../../services/uploadDocuments/uploadDocuments.service";

// WRAPPERS
import SymptomWrapper from "../../ApiWrapper/web/symptoms";
import DocumentWrapper from "../../ApiWrapper/web/uploadDocument";

import {DOCUMENT_PARENT_TYPE} from "../../../constant";

const Log = new Logger("WEB > CONTROLLERS > SYMPTOMS");

class SymptomController extends Controller {
    constructor() {
        super();
    }

    getBatchSymptomDetails = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req.body ----> ", req.body);
            const {body: {symptom_ids = []} = {}} = req;

            let documentData = {};
            let symptomData = {};
            let userData = {};
            let patientData = {};
            let doctorData = {};

            for (const id of symptom_ids) {
                const symptomExists = await SymptomService.getByData({id});

                if (symptomExists) {
                    const symptom = await SymptomWrapper({data: symptomExists});
                    const {symptoms} = await symptom.getAllInfo();
                    const {users, upload_documents, patients, doctors} = await symptom.getReferenceInfo();
                    symptomData = {...symptomData, ...symptoms};
                    userData = {...userData, ...users};
                    documentData = {...documentData, ...upload_documents};
                    patientData = {...patientData, ...patients};
                    doctorData = {...doctorData, ...doctors};
                }
            }

            return raiseSuccess(
                res,
                200,
                {
                    symptoms: {
                        ...symptomData
                    },
                    upload_documents: {
                        ...documentData
                    },
                    users: {
                        ...userData
                    },
                    doctors: {
                        ...doctorData
                    },
                    patients: {
                        ...patientData
                    }
                },
                "Symptom details fetched successfully"
            );
        } catch (error) {
            Log.debug("symptoms getSymptomDetails 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new SymptomController();
