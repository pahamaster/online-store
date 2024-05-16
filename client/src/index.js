import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
import BasketStore from './store/BasketStore';
import OrderStore from './store/OrderStore';
import UIStore from './store/UIStore';
import ReviewStore from './store/ReviewStore';

export const Context=createContext(null);

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    device: new DeviceStore(),
    basket: new BasketStore(),
    order: new OrderStore(),
    ui: new UIStore(),
    review: new ReviewStore()
  }}>
      <App />
  </Context.Provider>,
  document.getElementById('root')
);
