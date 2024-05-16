import {makeAutoObservable} from 'mobx';

export default class BasketStore {
  constructor() {
    this._basketDevices=[];
    this._count=0;
    makeAutoObservable(this);
  }

  setBasketDevices(devices) {
    this._basketDevices=devices;
  }
  setCount(count) {
    this._count=count;
  }

  get basketDevices() {
    return this._basketDevices;
  }
  get count() {
    return this._count;
  }
  get totalPrice() {
    let iVal=0;
    return this._basketDevices.reduce((sum, cur)=>
      sum+cur.device.price*cur.count, iVal);
  }

}