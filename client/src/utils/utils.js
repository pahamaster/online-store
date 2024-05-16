import {lBasket} from './consts';

export const formatDate=(str)=>{
  const d=new Date(str);
  const formatter = new Intl.DateTimeFormat("ru", 
    {
      year: "numeric", month: "numeric", day: "numeric",
      hour: 'numeric', minute: 'numeric'
    }
  );
  return formatter.format(d);
}

export const formatRub=(str)=>{
  let formatter = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0
  });
  return formatter.format(str);
}

export const getLocalBasketDevices=()=>{
  try {
    return JSON.parse(localStorage.getItem(lBasket) || []);
  } catch (e) {
    return [];
  }
}

export const setLocalBasketDevices=(devs)=>{
  localStorage.setItem(lBasket, JSON.stringify(devs));
}