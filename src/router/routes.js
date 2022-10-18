import Dashboard from '@/views/pages/Dashboard.vue'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import EmptyLayout from '../views/layouts/EmptyLayout.vue'

export default [
   {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
         middleware: [auth],
      },
   },
   {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('@/views/pages/vehicles/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   {
      path: '/vehicles/edit/:id',
      name: 'vehicles-edit',
      component: () => import('@/views/pages/vehicles/edit.vue'),
      meta: {
         middleware: [auth]
      },
   },
   {
      path: '/vehicles/details/:id',
      name: 'vehicles-details',
      component: () => import('@/views/pages/vehicles/details.vue'),
      meta: {
         middleware: [auth]
      },
   },
   {
      path: '/vehicles/create',
      name: 'vehicles-create',
      component: () => import('@/views/pages/vehicles/create.vue'),
      meta: {
         middleware: [auth]
      },
   },
   {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/pages/settings/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   {
      path: '/settings/general',
      name: 'general-settings',
      component: () => import('@/views/pages/settings/general.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Location
   {
      path: '/settings/location',
      name: 'location-settings',
      component: () => import('@/views/pages/settings/location/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Vehicle data
   {
      path: '/settings/vehicle-data',
      name: 'vehicle-data-settings',
      component: () => import('@/views/pages/settings/vehicle-data/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Billing
   {
      path: '/settings/billing',
      name: 'billing-settings',
      component: () => import('@/views/pages/settings/billing/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Notifications
   {
      path: '/settings/notifications',
      name: 'notifications-settings',
      component: () => import('@/views/pages/settings/notifications/index.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Account settings
   {
      path: '/settings/accounts',
      name: 'accounts-settings',
      component: () => import('@/views/pages/settings/accounts.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Legal
   {
      path: '/settings/legal',
      name: 'legal-settings',
      component: () => import('@/views/pages/settings/legal.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Profile
   {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/pages/Profile.vue'),
      meta: {
         middleware: [auth]
      },
   },
   // Login
   {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/auth/Login.vue'),
      meta: {
         middleware: [guest],
         layout: EmptyLayout
      },
   },
   // Carcopy list
   {
      path: '/carcopy',
      name: 'carcopy-list',
      component: () => import('@/views/pages/carcopy/index.vue'),
      meta: {
         middleware: [auth],
      },
   },
   // Carcopy Edit
   {
      path: '/carcopy/edit/:id',
      name: 'carcopy-edit',
      component: () => import('@/views/pages/carcopy/edit.vue'),
      meta: {
         middleware: [auth],
      },
   }
]
