import { HomeIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/accounts'

const path = (root, item) => `${root}${item}`;

export const accounts = {
    id: 'accounts',
    type: NAV_TYPE_ROOT,
    path: '/accounts',
    title: 'Accounts',
    transKey: 'nav.accounts.accounts',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'accounts.accounts',
            path: path(ROOT_DASHBOARDS, '/account'),
            type: NAV_TYPE_ITEM,
            title: 'Accounts',
            transKey: 'nav.accounts.accounts',
            Icon: HomeIcon,
        },
      

    ]
}
