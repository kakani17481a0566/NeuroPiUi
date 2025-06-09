import { HomeIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Dashboards',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.home',
            path: path(ROOT_DASHBOARDS, '/home'),
            type: NAV_TYPE_ITEM,
            title: 'Home',
            transKey: 'nav.dashboards.home',
            Icon: HomeIcon,
        },
        {
            id: 'dashboards.Test',
            path: path(ROOT_DASHBOARDS, '/test'),
            type: NAV_TYPE_ITEM,
            title: 'Test',
            transKey: 'nav.dashboards.Test',
            Icon: HomeIcon,
        },
        {
            id: 'dashboards.Teacher',
            path: path(ROOT_DASHBOARDS, '/teacher'),
            type: NAV_TYPE_ITEM,
            title: 'Home',
            transKey: 'Home',
            Icon: HomeIcon,
        },

    ]
}
