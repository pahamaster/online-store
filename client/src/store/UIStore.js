import {makeAutoObservable} from 'mobx';

export default class UIStore {
  constructor() {
    this._keyDevicePageTab='';
    this._keyMyOrderTab='';
    this._keyOrderTab='';
    this._myOrderModalVisible=false;
    this._orderModalVisible=false;
    //this._orderId=null;
    makeAutoObservable(this);
  }

  // setOrderId(orderId) {
  //   this._orderId=orderId;
  // }
  // get orderId() {
  //   return this._orderId;
  // }

  setKeyDevicePageTab(keyTab) {
    this._keyDevicePageTab=keyTab;
  }
  get keyDevicePageTab() {
    return this._keyDevicePageTab;
  }

  setKeyMyOrderTab(keyTab) {
    this._keyMyOrderTab=keyTab;
  }
  get keyMyOrderTab() {
    return this._keyMyOrderTab;
  }

  setKeyOrderTab(keyTab) {
    this._keyOrderTab=keyTab;
  }
  get keyOrderTab() {
    return this._keyOrderTab;
  }

  setMyOrderModalVisible(f) {
    this._myOrderModalVisible=f;
  }
  get myOrderModalVisible() {
    return this._myOrderModalVisible;
  }

  setOrderModalVisible(f) {
    this._orderModalVisible=f;
  }
  get orderModalVisible() {
    return this._orderModalVisible;
  }

}