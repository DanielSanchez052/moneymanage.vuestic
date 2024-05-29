export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'folder_open',
      },
    },
    {
      name: 'transactions',
      displayName: 'menu.transactions',
      meta: {
        icon: 'account_balance_wallet',
      },
    },
    {
      name: 'sources',
      displayName: 'menu.sources',
      meta: {
        icon: 'drag_indicator',
      },
    },
    {
      name: 'budgets',
      displayName: 'menu.budgets',
      meta: {
        icon: 'local_atm',
      },
    },
    // {
    //   name: 'preferences',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
  ] as INavigationRoute[],
}
