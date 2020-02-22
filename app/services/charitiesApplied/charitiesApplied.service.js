const CharityAppliedModel = require("../../models/charityApplied");

class CharityAppliedService {
  async createContributionRequest(data) {
    try {
      let contributionRequests = await CharityAppliedModel.create(data);
      return contributionRequests;
    } catch (error) {
      throw error;
    }
  }

  async getContributionRequestsByCharity(charityId, level) {
    try {
      let contributionRequests = await CharityAppliedModel.find({
        charityId,
        currentLevel: level
      });
      return contributionRequests;
    } catch (error) {
      throw error;
    }
  }

  async getContributionRequest(id) {
    try {
      let contributionRequest = await CharityAppliedModel.findById(id).lean();
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async rejectContributionRequest(id, rejectReason, level) {
    try {
      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "Rejected",
            rejectReason: rejectReason,
            [`levelApprovals.${level}`]: "Rejected"
          }
        },
        {
          new: true
        }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async approveLevelRequest(id, level, nextLevel) {
    try {
      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        id,
        {
          $set: {
            [`levelApprovals.${level}`]: "Approved"
          },
          $push: {
            currentLevel: nextLevel
          }
        },
        {
          new: true
        }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async uploadPOAndApproveRequest(requestData) {
    try {
      const { poObject, requestId, level } = requestData;

      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            PO: poObject,
            [`levelApprovals.${level}`]: "Approved",
            status: "Approved"
          }
        },
        {
          new: true
        }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async uploadPOAndApproveRequestByCarecoach(requestData) {
    try {
      const { poObject, requestId, currentLevel, levelApprovals } = requestData;
      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            PO: poObject,
            status: "Approved",
            levelApprovals,
            currentLevel
          }
        },
        { new: true }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async requestReupload(data) {
    try {
      const { comment, requestId, selectedDocId } = data;
      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        requestId,
        {
          $push: { [`charityDocs.${selectedDocId}.comment`]: comment },
          $set: { [`charityDocs.${selectedDocId}.shouldReupload`]: true }
        },

        { new: true }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }

  async uploadInvoice(requestData) {
    try {
      const { invoiceData, requestId } = requestData;

      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            invoice: invoiceData
          }
        },
        {
          new: true
        }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }
  async ReUploadDoc(requestData) {
    try {
      const { docs, docId, requestId } = requestData;
      const query = `charityDocs.${docId}.docs`;
      let contributionRequest = await CharityAppliedModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            [query]: docs
          }
        },
        {
          new: true
        }
      );
      return contributionRequest;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CharityAppliedService();
