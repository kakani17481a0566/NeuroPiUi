import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant';
import { getSessionData } from "utils/sessionStorage";

const ROOT_ACADEMICS = '/academics';

const path = (root, item) => `${root}${item}`;

const details = getSessionData();
const role = details?.role ?? "";

// Build childs dynamically based on role
let childs = [];

if (role === "Teacher") {
    childs = [
        {
            id: 'academics.termplan',
            path: path(ROOT_ACADEMICS, '/termplan'),
            type: NAV_TYPE_ITEM,
            title: 'TermPlan',
            transKey: 'nav.academics.termplan',
            Icon: AcademicCapIcon,
        },
        {
            id: 'academics.weeklyplan',
            path: path(ROOT_ACADEMICS, '/weeklyplan'),
            type: NAV_TYPE_ITEM,
            title: 'Weeklyplan',
            transKey: 'nav.academics.weeklyplan',
            Icon: AcademicCapIcon,
        }
    ];
} else if (role?.toLowerCase() === "admin" || role?.toLowerCase()=="chairman") {
    childs = [
        {
            id: 'academics.termplan',
            path: path(ROOT_ACADEMICS, '/termplan'),
            type: NAV_TYPE_ITEM,
            title: 'TermPlan',
            transKey: 'nav.academics.termplan',
            Icon: AcademicCapIcon,
        },
        {
            id: 'academics.weeklyplan',
            path: path(ROOT_ACADEMICS, '/weeklyplan'),
            type: NAV_TYPE_ITEM,
            title: 'Weeklyplan',
            transKey: 'nav.academics.weeklyplan',
            Icon: AcademicCapIcon,
        },
        {
            id: 'academics.students',
            path: path(ROOT_ACADEMICS, '/students'),
            type: NAV_TYPE_ITEM,
            title: 'Students',
            transKey: 'nav.academics.Students',
            Icon: AcademicCapIcon,
        }
    ];
}

// Now export the academics section with dynamic childs
export const academics = {
    id: 'academics',
    type: NAV_TYPE_ROOT,
    path: '/academics',
    title: 'Academics',
    transKey: 'nav.academics.academics',
    Icon: AcademicCapIcon,
    childs
};
