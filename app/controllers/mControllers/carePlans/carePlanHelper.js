import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import appointmentService from "../../../services/appointment/appointment.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../../services/medicine/medicine.service";




export const getCarePlanAppointmentIds =async(carePlanId)=>{

    let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);
    let carePlanAppointmentIds=[];
    for (let appointment of carePlanAppointments){
         
        let appointmentId=appointment.get('appointment_id');
        carePlanAppointmentIds.push(appointmentId);
    }

    return carePlanAppointmentIds
}

export const getCarePlanMedicationIds =async(carePlanId)=>{


    let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
    let carePlanMedicationIds =[];
    
     for (let medication of carePlanMedications){
        let medicationId=medication.get('medication_id');
        carePlanMedicationIds.push(medicationId);   

     }

     return carePlanMedicationIds;
}

export const getCarePlanSeverityDetails =async(carePlanId)=>{

    let carePlan= await carePlanService.getCarePlanById(carePlanId);

    const carePlanApiWrapper = await CarePlanWrapper(carePlan);

    let  treatment = '';
    let severity = '';
    let condition = '';
    let carePlanTemplate={};

    const templateId = carePlanApiWrapper.getCarePlanTemplateId();
    if(templateId){
        carePlanTemplate= await carePlanTemplateService.getCarePlanTemplateById(templateId);
        treatment = carePlanTemplate.get('type')?carePlanTemplate.get('type'):'';
        severity = carePlanTemplate.get('severity')?carePlanTemplate.get('severity'):'';
        condition =carePlanTemplate.get('condition')?carePlanTemplate.get('condition'):'';
       }else{
       let details=carePlanApiWrapper.getCarePlanDetails();
       treatment=details.type;
       severity=details.severity;
       condition=details.condition;
       }

     return {treatment,severity,condition};
}