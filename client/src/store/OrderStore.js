import {makeAutoObservable} from 'mobx';

export default class OrderStore {
  constructor() {
    this._orders=[];
    this._myOrders=[];
    this._order={};
    this._orderId=null;
    this._page=1;
    this._totalCount=0;
    this._limit=5;
    this._fUpdate=false;
    makeAutoObservable(this);
  }

  setFUpdate() {
    this._fUpdate=!(this._fUpdate);
  }
  get fUpdate() {
    return this._fUpdate;
  }

  setOrderId(orderId) {
    this._orderId=orderId;
  }
  get orderId() {
    return this._orderId;
  }

  setPage(p) {
    this._page=p;
  }
  get page() {
    return this._page;
  }

  setTotalCount(totalCount) {
    this._totalCount=totalCount;
  }
  get totalCount() {
    return this._totalCount;
  }

  setLimit(limit) {
    this._limit=limit;
  }
  get limit() {
    return this._limit;
  }

  setMyOrders(orders) {
    this._myOrders=orders;
  }

  get myOrders() {
    return this._myOrders;
  }

  setOrders(orders) {
    this._orders=orders;
  }

  get orders() {
    return this._orders;
  }

  setOrder(order) {
    this._order=order;
  }

  get order() {
    return this._order;
  }

  orderTotalPrice() {
    let iVal=0;
    return this._order?.order_devices?.reduce((sum, cur)=>
      sum+cur.price*cur.count, iVal);
  }

  myOrdersTotalPrice(i) {
    let iVal=0;
    return this._myOrders[i]?.order_devices?.reduce((sum, cur)=>
      sum+cur.price*cur.count, iVal);
  }

  ordersTotalPrice(i) {
    let iVal=0;
    return this._orders[i]?.order_devices?.reduce((sum, cur)=>
      sum+cur.price*cur.count, iVal);
  }

}