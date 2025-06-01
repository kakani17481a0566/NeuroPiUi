// rows.jsx
import { Badge } from "components/ui";
import { userStatusOptions } from "./data";

export const UserIdCell = ({ getValue }) => {
  return <span className="font-medium">{getValue()}</span>;
};

export const UsernameCell = ({ getValue }) => {
  return <span className="font-medium text-primary-600 dark:text-primary-400">{getValue()}</span>;
};

export const NameCell = ({ getValue }) => {
  const { firstName, middleName, lastName } = getValue();
  return (
    <span>
      {firstName} {middleName ? `${middleName} ` : ''}{lastName}
    </span>
  );
};

export const EmailCell = ({ getValue }) => {
  return <span className="text-gray-600 dark:text-gray-300">{getValue()}</span>;
};

export const MobileCell = ({ getValue }) => {
  return <span>{getValue() || '-'}</span>;
};

export const StatusCell = ({ getValue }) => {
  const status = getValue();
  const statusOption = userStatusOptions.find(opt => opt.value === status) || userStatusOptions[0];
  
  return (
    <Badge color={statusOption.color} className="capitalize">
      {statusOption.label}
    </Badge>
  );
};