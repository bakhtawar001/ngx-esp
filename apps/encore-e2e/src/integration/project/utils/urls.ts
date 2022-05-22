const projects = '/babou/api/vulcan/projects';

export const URLs = {
  api: {
    projects: `${projects}`,
    projectSearch: `/babou/api/esp/companies/search`,
    recentCollectionAPIurl: `${projects}/searchrecent`,
    productUrl: '/babou/api/ardor/products/search',
    productDetailsPath: '/v1/suppliers/',
    autocompleteUsers: '/babou/api/esp/autocomplete/users?*',
  },
} as const;
