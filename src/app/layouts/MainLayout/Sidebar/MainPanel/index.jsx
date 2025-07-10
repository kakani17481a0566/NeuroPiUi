import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router"; // if v6: useNavigate
import clsx from "clsx";
import Logo from "assets/round_logo_50_50_t.svg?react";
import { Menu } from "./Menu";
import { Item } from "./Menu/Item";
import { Profile } from "../../Profile";
import { useThemeContext } from "app/contexts/theme/context";
// import { useUserContext } from "app/contexts/user/context";
import { settings } from "app/navigation/settings";
import { getSessionData } from "utils/sessionStorage";

export function MainPanel({ nav, setActiveSegment, activeSegment }) {
  const { cardSkin } = useThemeContext();
  const{role}=getSessionData();
const navigate = useNavigate();
  // const history = useHistory();

  const handleLogoClick = () => {
    if (role === "Teacher") {
    navigate("dashboards/teacher");
  } else if (role === "Nanny") {
    navigate("dashboards/attendance");
  } else {
    navigate("/");
  }
};

  return (
    <div className="main-panel">
      <div
        className={clsx(
          "border-primary-950 flex h-full w-full flex-col items-center rounded-r-xl border-r-2 bg-white",
          cardSkin === "shadow-sm" ? "dark:bg-dark-750" : "dark:bg-dark-900"
        )}
      >
        <div className="w-full rounded-r-xl">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo className="text-primary-600 dark:text-primary-400 h-[80px] w-[65px]" />
          </div>
        </div>

        <Menu
          nav={nav}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />

        <div className="flex flex-col items-center space-y-3 py-2.5 text-primary-600">
          <Item
            id={settings.id}
            component={Link}
            to="/settings/appearance"
            title={"Settings"}
            isActive={activeSegment === settings.path}
            Icon={settings.Icon}
          />
          <Profile />
        </div>
      </div>
    </div>
  );
}

MainPanel.propTypes = {
  nav: PropTypes.array,
  setActiveSegment: PropTypes.func,
  activeSegment: PropTypes.string,
};
