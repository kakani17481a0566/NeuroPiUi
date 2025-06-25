import { NAV_TYPE_ITEM, } from "constants/app.constant";
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
// import { AcademicCapIcon as AcademicIcons } from "@heroicons/react/24/outline";
import AcademicIcon from 'assets/dualicons/academic_outline.svg?react'


export const baseNavigation = [
    {
        id: 'dashboards',
        type: NAV_TYPE_ITEM,
        path: '/dashboards',
        title: 'Dashboards',
        transKey: 'nav.dashboards.dashboards',
        Icon: DashboardsIcon,
    },
    {
        id: 'academics',
        type: NAV_TYPE_ITEM,
        path: '/academics',
        title: 'Academics',
        transKey: 'nav.academics.academics',
        Icon: AcademicIcon,
    },
    

]


