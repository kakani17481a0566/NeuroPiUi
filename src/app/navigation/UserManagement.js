
import { UserIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_ACADEMICS = '/usermanagement'

const path = (root, item) => `${root}${item}`;

export const UserManagement = {
    id: 'UserManagement',
    type: NAV_TYPE_ROOT,
    path: '/usermanagement',
    title: 'UserManagement',
    transKey: 'nav.usermanagement.usermanagement',
    Icon: UserIcon,
    childs: [
        {
            id: 'UserManagement.Role',
            path: path(ROOT_ACADEMICS, '/role'),
            type: NAV_TYPE_ITEM,
            title: 'Roles',
            transKey: 'nav.usermanagement.role',
            Icon: UserIcon,
        },
        
        

    ]
}
