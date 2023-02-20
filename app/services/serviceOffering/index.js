export default class ServiceOffering {
  constructor(data) {
    this._data = data;
  }

  getId = () => this._data.id;

  getProviderType = () => this._data.provider_type;

  getProviderId = () => this._data.provider_id;

  getServiceOfferingName = () => this._data.service_offering_name;

  getDescription = () => this._data.description;

  getServiceCharge = () => this._data.service_charge;

  getCurrency = () => this._data.currency;
  getCreatedAt = () => this._data.created_at;

  getUpdatedAt = () => this._data.updated_at;
}
