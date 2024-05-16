import {makeAutoObservable} from 'mobx';

export default class DeviceStore {
  constructor() {
    this._types=[];
    this._brands=[];
    this._barTypes=[];
    this._barBrands=[];
    this._devices=[];
    this._selectedType=null;
    this._selectedBrand=null;
    this._page=1;
    this._totalCount=0;
    this._limit=8;
    this._searchValue='';
    this._instock=false;
    this._fUpdate=false;
    makeAutoObservable(this);
  }

  setFUpdate() {
    this._fUpdate=!this._fUpdate;
  }
  get fUpdate() {
    return this._fUpdate;
  }

  setInstock() {
    this._page=1;
    this._instock=!this._instock;
  }
  setSearchValue(value) {
    this._searchValue=value;
  }
  set(what, how) {
    this['_'+what+'s']=how;
  }
  setTypes(types) {
    this._types=types;
  }
  setBrands(brands) {
    this._brands=brands;
  }
  setBarTypes(types) {
    this._barTypes=types;
  }
  setBarBrands(brands) {
    this._barBrands=brands;
  }
  setDevices(devices) {
    this._devices=devices;
  }
  setSelectedType(type, resetPage) {
    if (resetPage) this._page=1;
    this._selectedType=type;
  }
  setSelectedBrand(brand, resetPage) {
    if (resetPage) this._page=1;
    this._selectedBrand=brand;
  }
  setPage(page) {
    this._page=page;
  }
  setTotalCount(totalCount) {
    this._totalCount=totalCount;
  }
  setLimit(limit) {
    this._limit=limit;
  }

  get instock() {
    return this._instock;
  }
  get searchValue() {
    return this._searchValue;
  }
  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get barTypes() {
    return this._barTypes;
  }
  get barBrands() {
    return this._barBrands;
  }
  get devices() {
    return this._devices;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedBrand() {
    return this._selectedBrand;
  }
  get page() {
    return this._page;
  }
  get totalCount() {
    return this._totalCount;
  }
  get limit() {
    return this._limit;
  }

}