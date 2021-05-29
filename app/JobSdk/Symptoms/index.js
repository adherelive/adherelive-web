export default class SymptomsJob {
    constructor(data) {
      this._data = data;
    }
  
    getSymptomsData = () => {
      return this._data;
    };
  
    getUsers = () => {
      const { participants = [] } = this._data || {};
      return participants;
    };
  }
  