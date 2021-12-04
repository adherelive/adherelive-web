export const accountDetailsUrl = () => {
  return `/accounts?all_accounts=1`;
};

export const accountDetailsForCreatedByProviderUrl = (provider_id) => {
  return `/accounts?all_accounts=1&provider_id=${provider_id}`;
};

export const updateAccountDetailsUrl = (id) => {
  return `/accounts/${id}`;
};
