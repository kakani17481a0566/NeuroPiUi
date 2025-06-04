
import AcademicsIcon from 'assets/dualicons/academics.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_ACADEMICS = '/academics'

const path = (root, item) => `${root}${item}`;

export const academics = {
    id: 'academics',
    type: NAV_TYPE_ROOT,
    path: '/academics',
    title: 'Academics',
    transKey: 'nav.academics.academics',
    Icon: AcademicsIcon,
    childs: [
        {
            id: 'academics.termplan',
            path: path(ROOT_ACADEMICS, '/termplan'),
            type: NAV_TYPE_ITEM,
            title: 'TermPlan',
            transKey: 'nav.academics.termplan',
            Icon: AcademicsIcon,
        },
        {
            id: 'academics.weeklyplan',
            path: path(ROOT_ACADEMICS, '/weeklyplan'),
            type: NAV_TYPE_ITEM,
            title: 'weeklyplan',
            transKey: 'nav.academics.weeklyplan',
            Icon: AcademicsIcon,

        }

    ]
}
