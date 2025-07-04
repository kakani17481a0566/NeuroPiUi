import { NAV_TYPE_ITEM } from "constants/app.constant";
import { HomeIcon, AcademicCapIcon } from "@heroicons/react/24/outline"; // ✅ Icon imports

export const baseNavigation = [
  {
    id: 'dashboards',
    type: NAV_TYPE_ITEM,
    path: '/dashboards',
    title: 'Dashboards',
    transKey: 'nav.dashboards.dashboards',
    Icon: HomeIcon, // 🏠 Dashboard icon
  },
  {
    id: 'academics',
    type: NAV_TYPE_ITEM,
    path: '/academics',
    title: 'Academics',
    transKey: 'nav.academics.academics',
    Icon: AcademicCapIcon, // 🎓 Academics icon
  },
   {
    id: 'accounts',
    type: NAV_TYPE_ITEM,
    path: '/accounts',
    title: 'Accounts',
    transKey: 'nav.accounts.accounts',
    Icon: AcademicCapIcon, // 🎓 Academics icon
  },
];
