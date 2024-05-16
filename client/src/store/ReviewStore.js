import {makeAutoObservable} from 'mobx';

export default class UIStore {
  constructor() {
    this._fUpdate=false;
    this._page=1;
    this._totalCount=0;
    this._limit=5;
    makeAutoObservable(this);
  }

  setFUpdate() {
    this._fUpdate=!(this._fUpdate);
  }
  get fUpdate() {
    return this._fUpdate;
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

}