import {Routes} from "~/types/routes";

export const getRouteTitle = (routeName: Routes) => {
  switch (routeName) {
    case Routes.ADMIN_BOOKINGS:
      return 'Записи'
    case Routes.ADMIN_GUESTS:
      return 'Гості'
    case Routes.ADMIN_DASHBOARD:
      return 'Головна'
    case Routes.ADMIN_PROPERTIES:
      return "Об'єкти"
    case Routes.ADMIN_REPORTS:
      return 'Звіти'
    case Routes.ADMIN_SETTINGS:
      return 'Налаштування'
  }
}
