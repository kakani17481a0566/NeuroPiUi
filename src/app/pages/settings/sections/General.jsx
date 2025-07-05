// Import Dependencies
import {
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Avatar, Input } from "components/ui";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

export default function General() {
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/100x100.png");

  const { userId, tenantId } = getSessionData();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/${userId}?tenantId=${tenantId}`
        );
        const user = res.data?.data;

        setDisplayName(user.username || "");
        setFullName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
        setEmail(user.email || "");
        setPhone(user.mobileNumber || "");
        setImageUrl(user.userImageUrl?.trim() || "/images/100x100.png");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-full font-lato max-w-3xl 2xl:max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary-800 dark:text-primary-300">
          User Info
        </h1>
        <p className="text-sm text-primary-500 dark:text-primary-400">
          View your account details
        </p>
        <hr className="mt-4 border-gray-200 dark:border-dark-600" />
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <Avatar
          size={24}
          imgComponent={PreviewImg}
          imgProps={{ src: imageUrl }}
          src={imageUrl}
          classNames={{
            root:
              "rounded-xl ring-2 ring-primary-600 dark:ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-900 transition-all shadow-md",
            display: "rounded-xl",
          }}
        />
        <div>
          <p className="text-lg font-medium text-primary-900 dark:text-primary-100">
            {fullName || "No Name"}
          </p>
          <p className="text-sm text-primary-500 dark:text-primary-400">
            {displayName || "No Username"}
          </p>
        </div>
      </div>

      {/* User Info Fields */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Display Name"
          value={displayName}
          prefix={<UserIcon className="size-4.5 text-primary-600" />}
          readOnly
          className="rounded-xl cursor-not-allowed bg-gray-100 dark:bg-dark-700 text-primary-950 dark:text-primary-300"
        />
        <Input
          label="Full Name"
          value={fullName}
          prefix={<UserIcon className="size-4.5 text-primary-600" />}
          readOnly
          className="rounded-xl cursor-not-allowed bg-gray-100 dark:bg-dark-700 text-primary-950 dark:text-primary-300"
        />
        <Input
          label="Email"
          value={email}
          prefix={<EnvelopeIcon className="size-4.5 text-primary-600" />}
          readOnly
          className="rounded-xl cursor-not-allowed bg-gray-100 dark:bg-dark-700 text-primary-950 dark:text-primary-300"
        />
        <Input
          label="Phone Number"
          value={phone}
          prefix={<PhoneIcon className="size-4.5 text-primary-600" />}
          readOnly
          className="rounded-xl cursor-not-allowed bg-gray-100 dark:bg-dark-700 text-primary-950 dark:text-primary-300"
        />
      </div>
    </div>
  );
}
