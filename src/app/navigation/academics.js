
import AcademicIcon from 'assets/dualicons/academics.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_ACADEMICS = '/academics'

const path = (root, item) => `${root}${item}`;

export const academics = {
    id: 'academics',
    type: NAV_TYPE_ROOT,
    path: '/academics',
    title: 'Academics',
    transKey: 'nav.academics.academics',
    Icon: AcademicIcon,
    childs: [
        {
            id: 'academics.termplan',
            path: path(ROOT_ACADEMICS, '/termplan'),
            type: NAV_TYPE_ITEM,
            title: 'TermPlan',
            transKey: 'nav.academics.termplan',
            Icon: AcademicIcon,
        },
        {
            id: 'academics.weeklyplan',
            path: path(ROOT_ACADEMICS, '/weeklyplan'),
            type: NAV_TYPE_ITEM,
            title: 'weeklyplan',
            transKey: 'nav.academics.weeklyplan',
            Icon: AcademicIcon,

        },
        {
            id: 'academics.students',
            path: path(ROOT_ACADEMICS, '/students'),
            type: NAV_TYPE_ITEM,
            title: 'students',
            transKey: 'nav.academics.Students',
            Icon: AcademicIcon,

        },
        // {
        //     id: 'academics.grades',
        //     path: path(ROOT_ACADEMICS, '/grades'),
        //     type: NAV_TYPE_ITEM,
        //     title: 'Grades',
        //     transKey: 'nav.academics.Grades',
        //     Icon: AcademicsIcon,

        // },
        

    ]
}
