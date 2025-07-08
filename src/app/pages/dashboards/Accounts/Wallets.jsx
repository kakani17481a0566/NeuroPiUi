import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, Input, Select } from "components/ui";
import {
  BanknotesIcon,
  ArrowRightCircleIcon,
  CurrencyRupeeIcon ,
  ArrowPathIcon ,
  CheckCircleIcon ,
  PencilSquareIcon ,
  BuildingLibraryIcon ,
  BuildingOffice2Icon ,CalendarDaysIcon 
} from "@heroicons/react/24/outline";

import {
  transferMoney,
  getTransactionModes,
  getTransactionStatuses,
  getAccountHeads,
  getAccountsByTenant,
} from "./data";

export function Wallets({ onTransferSuccess }) {
  const [amount, setAmount] = useState("");
  const [debitAccId, setDebitAccId] = useState("");
  const [creditAccId, setCreditAccId] = useState("");
  const [trxModeId, setTrxModeId] = useState("");
  const [trxStatusId, setTrxStatusId] = useState("");
  const [debitAccHeadId, setDebitAccHeadId] = useState("");
  const [creditAccHeadId, setCreditAccHeadId] = useState("");
  const [trxDate, setTrxDate] = useState("");
  const [trxDesc, setTrxDesc] = useState("");

  const [trxModes, setTrxModes] = useState([]);
  const [trxStatuses, setTrxStatuses] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const clearForm = () => {
    setAmount("");
    setDebitAccId("");
    setCreditAccId("");
    setTrxModeId("");
    setTrxStatusId("");
    setDebitAccHeadId("");
    setCreditAccHeadId("");
    setTrxDate("");
    setTrxDesc("");
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [modes, statuses, heads, accs] = await Promise.all([
          getTransactionModes(),
          getTransactionStatuses(),
          getAccountHeads(),
          getAccountsByTenant(),
        ]);
        setTrxModes(modes);
        setTrxStatuses(statuses);
        setAccountHeads(heads);
        setAccounts(accs);

        const userData = JSON.parse(localStorage.getItem("userId"));
        setDebitAccId(userData?.accountId || "");
      } catch (e) {
        console.error("Failed loading dropdown data", e);
        toast.error("Failed to load required data.");
      }
    };
    fetchInitialData();
  }, []);

  const handleTransfer = async () => {
    if (
      !debitAccId ||
      !creditAccId ||
      !amount ||
      !trxModeId ||
      !trxStatusId ||
      !trxDesc ||
      !trxDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      debitAccId: Number(debitAccId),
      creditAccId: Number(creditAccId),
      amount: parseFloat(amount),
      trxModeId: Number(trxModeId),
      trxStatus: Number(trxStatusId),
      tenantId: 1,
      createdBy: 1,
      trxDesc,
      debitAccHeadId: debitAccHeadId ? Number(debitAccHeadId) : null,
      creditAccHeadId: creditAccHeadId ? Number(creditAccHeadId) : null,
      trxDate,
    };

    toast.promise(
      transferMoney(payload).then(() => {
        if (onTransferSuccess) onTransferSuccess(); // Trigger refresh on success
      }),
      {
        loading: "Processing transfer...",
        success: "Money transferred successfully!",
        error: "Transfer failed. Please try again.",
        className: "soft-color",
      },
    );
  };

  return (
    <Card className="border-primary-600 dark:border-primary-600 col-span-12 border-2 pb-5 lg:col-span-4">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="text-dark-700 font-medium tracking-wide dark:text-gray-100">
          Wallets
        </h2>
        <ActionMenu />
      </div>

      <div className="mt-2 px-4 sm:px-5">
        <h2 className="dark:text-dark-100 font-medium tracking-wide text-gray-800">
          Send Money
        </h2>

        <div className="mt-4">
          <label
            htmlFor="debitAccId"
            className="block flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <BanknotesIcon className="text-primary-600 h-4 w-4" />
            From Account <span className="text-red-500">*</span>
          </label>
          <Select
            id="debitAccId"
            value={debitAccId}
            onChange={(e) => setDebitAccId(e.target.value)}
            className="mt-1"
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.account_name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-4">
          <label
            htmlFor="creditAccId"
            className="block flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <ArrowRightCircleIcon className="text-primary-600 h-4 w-4" />
            To Account <span className="text-red-500">*</span>
          </label>
          <Select
            id="creditAccId"
            value={creditAccId}
            onChange={(e) => setCreditAccId(e.target.value)}
            className="mt-1"
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.account_name}
              </option>
            ))}
          </Select>
        </div>

        {/* Amount */}
     <div className="mt-4">
  <label
    htmlFor="amount"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <CurrencyRupeeIcon className="w-4 h-4 text-primary-600" />
    Amount <span className="text-red-500">*</span>
  </label>
  <Input
    id="amount"
    type="number"
    placeholder="Enter Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className="mt-1"
  />
</div>


        {/* Transaction Mode */}
 <div className="mt-4">
  <label
    htmlFor="trxMode"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <ArrowPathIcon className="w-4 h-4 text-primary-600" />
    Transaction Mode <span className="text-red-500">*</span>
  </label>
  <Select
    id="trxMode"
    value={trxModeId}
    onChange={(e) => setTrxModeId(e.target.value)}
    className="mt-1"
  >
    <option value="">Select Mode</option>
    {trxModes.map((mode) => (
      <option key={mode.master_id} value={mode.master_id}>
        {mode.master_name}
      </option>
    ))}
  </Select>
</div>


        {/* Transaction Status */}
    <div className="mt-4">
  <label
    htmlFor="trxStatus"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <CheckCircleIcon className="w-4 h-4 text-primary-600" />
    Transaction Status <span className="text-red-500">*</span>
  </label>
  <Select
    id="trxStatus"
    value={trxStatusId}
    onChange={(e) => setTrxStatusId(e.target.value)}
    className="mt-1"
  >
    <option value="">Select Status</option>
    {trxStatuses.map((status) => (
      <option key={status.master_id} value={status.master_id}>
        {status.master_name}
      </option>
    ))}
  </Select>
</div>


        {/* Description */}
     <div className="mt-4">
  <label
    htmlFor="trxDesc"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <PencilSquareIcon className="w-4 h-4 text-primary-600" />
    Description <span className="text-red-500">*</span>
  </label>
  <Input
    id="trxDesc"
    type="text"
    placeholder="Purpose of transaction"
    value={trxDesc}
    onChange={(e) => setTrxDesc(e.target.value)}
    className="mt-1"
  />
</div>


        {/* Debit Account Head */}
 <div className="mt-4">
  <label
    htmlFor="debitAccHeadId"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <BuildingLibraryIcon className="w-4 h-4 text-primary-600" />
    From Account Head <span className="text-xs text-gray-500">(Optional)</span>
  </label>
  <Select
    id="debitAccHeadId"
    value={debitAccHeadId}
    onChange={(e) => setDebitAccHeadId(e.target.value)}
    className="mt-1"
  >
    <option value="">Select Account Head (Optional)</option>
    {accountHeads.map((head) => (
      <option key={head.master_id} value={head.master_id}>
        {head.master_name}
      </option>
    ))}
  </Select>
</div>

        {/* Credit Account Head */}
     <div className="mt-4">
  <label
    htmlFor="creditAccHeadId"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <BuildingOffice2Icon className="w-4 h-4 text-primary-600" />
    To Account Head <span className="text-xs text-gray-500">(Optional)</span>
  </label>
  <Select
    id="creditAccHeadId"
    value={creditAccHeadId}
    onChange={(e) => setCreditAccHeadId(e.target.value)}
    className="mt-1"
  >
    <option value="">Select Account Head (Optional)</option>
    {accountHeads.map((head) => (
      <option key={head.master_id} value={head.master_id}>
        {head.master_name}
      </option>
    ))}
  </Select>
</div>


        {/* Transaction Date */}
       <div className="mt-4">
  <label
    htmlFor="trxDate"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
  >
    <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
    Transaction Date <span className="text-red-500">*</span>
  </label>
  <Input
    id="trxDate"
    type="date"
    value={trxDate}
    onChange={(e) => setTrxDate(e.target.value)}
    className="mt-1"
  />
</div>


        <div className="mt-4 flex space-x-3">
          <Button
            color="primary"
            className="h-10 flex-1"
            onClick={handleTransfer}
          >
            Send Money
          </Button>

          <Button color="primary" className="h-10 flex-1" onClick={clearForm}>
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="dark:border-dark-500 dark:bg-dark-700 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
