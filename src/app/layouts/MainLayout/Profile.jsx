// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { TbUser } from "react-icons/tb";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

const links = [
  {
    id: "1",
    title: "Profile",
    description: "Your profile settings",
    to: "/settings/general",
    Icon: TbUser,
    color: "warning",
  },
];

export function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { userProfile, role, imageUrl } = getSessionData();

  const handleLogOut = async () => {
    console.log("Logging out...");
    await logout(); // Clears session and updates auth state
    navigate("/login?redirectUrl=/");
  };

  return (
    <Popover className="relative">
      <PopoverButton
        as={Avatar}
        size={15}
        role="button"
        src={imageUrl || "/default-profile.png"} // fallback image
        alt="Profile"
        indicator={<AvatarDot color="success" className="ltr:right-0 rtl:left-0" />}
        classNames={{ root: "cursor-pointer" }}
      />

      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-x-2 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "right end", gap: 12 }}
          className="z-70 flex w-64 flex-col rounded-lg border bg-white shadow-soft transition dark:border-dark-600 dark:bg-dark-700 dark:shadow-none"
        >
          {({ close }) => (
            <>
              <div className="flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5 dark:bg-dark-800 text-primary-950">
                <Avatar size={20} src={imageUrl || "/default-profile.png"} alt="Profile" />
                <div>
                  <p className="text-base font-medium text-gray-700 dark:text-dark-100 hover:text-primary-600 focus:text-primary-600 dark:hover:text-primary-400 dark:focus:text-primary-400">
                    {userProfile
                      ? `${userProfile.firstName ?? ""} ${userProfile.lastName ?? ""}`.trim()
                      : "User"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-50">
                    {role || "Role"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col pt-2 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.to}
                    onClick={close}
                    className="group flex items-center gap-3 px-4 py-2 tracking-wide transition-all hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-600 dark:focus:bg-dark-600"
                  >
                    <Avatar
                      size={8}
                      initialColor={link.color}
                      classNames={{ display: "rounded-lg" }}
                    >
                      <link.Icon className="size-4.5" />
                    </Avatar>
                    <div>
                      <h2 className="text-gray-800 font-medium transition-colors group-hover:text-primary-600 group-focus:text-primary-600 dark:text-dark-100 dark:group-hover:text-primary-400 dark:group-focus:text-primary-400">
                        {link.title}
                      </h2>
                      <div className="text-xs text-gray-400 truncate dark:text-dark-300">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="px-4 pt-4">
                  <Button className="w-full gap-2 bg-primary-600" onClick={handleLogOut}>
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
