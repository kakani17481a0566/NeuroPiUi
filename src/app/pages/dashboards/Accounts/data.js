// src/app/pages/dashboards/Accounts/data.js

import axios from "utils/axios";
import{GET_ACCOUNT_BY_TENANT,GET_ACCOUNT_HEADS,GET_TRANSACTION_TYPES,TRANSFER_MONEY,GET_TRANSACTION_MODES,GET_TRANSACTION_STATUS} from "constants/apis";

// Transfer Money API
export const transferMoney = async (payload) => {
  const response = await axios.post(`${TRANSFER_MONEY}`, payload);
  return response.data;
};

// Get Transaction Modes API
export const getTransactionModes = async () => {
  const response = await axios.get(`${GET_TRANSACTION_MODES}`);
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
    // const {tenantId}=getSessionData();

  const response = await axios.get(`${GET_TRANSACTION_STATUS}`)
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
  const response = await axios.get(`${GET_TRANSACTION_TYPES}`);
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
  const response = await axios.get(`${GET_ACCOUNT_HEADS}`);
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
  const response = await axios.get(`${GET_ACCOUNT_BY_TENANT}`);
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