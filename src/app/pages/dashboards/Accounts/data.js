// src/app/pages/dashboards/Accounts/data.js

import axios from "utils/axios";

// Transfer Money API
export const transferMoney = async (payload) => {
  const response = await axios.post("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Transaction/transfer", payload);
  return response.data;
};

// Get Transaction Modes API
export const getTransactionModes = async () => {
  const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/getByMasterTypeId/2/1?isUtilites=false");
  // Normalize keys
  return response.data.data.map((item) => ({
    master_id: item.id,
    master_name: item.name,
    tenantId: item.tenantId,
    masterTypeId: item.masterTypeId,
    code: item.code
  }));
};

// Get Transaction Statuses API (Corrected to MasterTypeId = 4)
export const getTransactionStatuses = async () => {
  const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/getByMasterTypeId/4/1?isUtilites=false");
  return response.data.data.map((item) => ({
    master_id: item.id,
    master_name: item.name,
    tenantId: item.tenantId,
    masterTypeId: item.masterTypeId,
    code: item.code
  }));
};

// Get Transaction Types API (MasterTypeId = 1)
export const getTransactionTypes = async () => {
  const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/getByMasterTypeId/1/1?isUtilites=false");
  return response.data.data.map((item) => ({
    master_id: item.id,
    master_name: item.name,
    tenantId: item.tenantId,
    masterTypeId: item.masterTypeId,
    code: item.code
  }));
};

// Get Account Heads API (MasterTypeId = 3)
export const getAccountHeads = async () => {
  const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/getByMasterTypeId/3/1?isUtilites=false");
  return response.data.data.map((item) => ({
    master_id: item.id,
    master_name: item.name,
    tenantId: item.tenantId,
    masterTypeId: item.masterTypeId,
    code: item.code
  }));
};

// Get All Accounts by Tenant
export const getAccountsByTenant = async () => {
  const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Account/tenant/1");
  return response.data.data.map((item) => ({
    account_id: item.id,
    account_name: item.accName,
    acc_type: item.accType,
    acc_number: item.accNumber,
    bank_name: item.bankName,
    ifsc_code: item.ifscCode,
    address: item.address,
    tenantId: item.tenantId,
    bookId: item.bookId
  }));
};