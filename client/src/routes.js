import Admin from './pages/Admin';
import Basket from './pages/Basket';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import DevicePage from './pages/DevicePage';
import ReviewPage from './pages/Review';
import MyOrders from './pages/MyOrders';
import Orders from './pages/Orders';
import {ORDERS_ROUTE, MYORDERS_ROUTE, REVIEW_ROUTE, ADMIN_ROUTE,
  BASKET_ROUTE, SHOP_ROUTE, LOGIN_ROUTE, DEVICE_ROUTE, REGISTRATION_ROUTE} from './utils/consts';

export const authRoutes=[
  {
    path: ADMIN_ROUTE,
    Component: Admin
  },
  {
    path: MYORDERS_ROUTE,
    Component: MyOrders
  },
  {
    path: ORDERS_ROUTE,
    Component: Orders
  },
]

export const publicRoutes=[
  {
    path: SHOP_ROUTE,
    Component: Shop
  },
  {
    path: BASKET_ROUTE,
    Component: Basket
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth
  },
  {
    path: DEVICE_ROUTE+'/:id',
    Component: DevicePage
  },
  {
    path: REVIEW_ROUTE,
    Component: ReviewPage
  },
]