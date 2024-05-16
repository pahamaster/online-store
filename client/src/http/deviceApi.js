import {$authHost, $host} from './index';
//import jwt_decode from 'jwt-decode';

export const updateOrderStatus=async (params)=>{
  const {data}=await $authHost.put('api/order', params);
  return data;
}

export const fetchOrderStatusName=async ()=>{
  const {data}=await $authHost.get('api/orderstatusname');
  return data;
}

export const createOrder=async ()=>{
  const {data}=await $authHost.post('api/order');
  return data;
}

// export const createOrder=async (devices)=>{
//   const {data}=await $authHost.post('api/order', {devices: JSON.stringify(devices)});
//   return data;
// }

export const fetchAuthOrders=async (params)=>{
  const {data}=await $authHost.get('api/order/user', {params})
  return data;
}

export const fetchAdminOrders=async (params)=>{
  const {data}=await $authHost.get('api/order', {params})
  return data;
}

export const fetchInfos=async ()=>{
  const {data}=await $authHost.get('api/info')
  return data;
}

export const createReview=async (review)=>{
  const {data}=await $authHost.post('api/review', review);
  return data;
}

export const updateReview=async (review)=>{
  const {data}=await $authHost.put('api/review', review);
  return data;
}

export const fetchReviewsByUserIdAndDeviceId=async ({userId, deviceId, page, limit})=>{
  const {data}=await $host.get('api/review', {params: {userId, deviceId, page, limit}});
  return data;
}

export const createInfo=async (info)=>{
  const {data}=await $authHost.post('api/info', info);
  return data;
}

export const createType=async (type)=>{
  const {data}=await $authHost.post('api/type', type);
  return data;
}

export const updateType=async (type)=>{
  const {data}=await $authHost.put('api/type', type);
  return data;
}

export const createBrand=async (brand)=>{
  const {data}=await $authHost.post('api/brand', brand);
  return data;
}

export const create=async (what, how)=>{
  const {data}=await $authHost.post('api/'+what, how);
  return data;
}

export const updateBrand=async (brand)=>{
  const {data}=await $authHost.put('api/brand', brand);
  return data;
}

export const update=async (what, how)=>{
  const {data}=await $authHost.put('api/'+what, how);
  return data;
}

export const fetchTypes=async ()=>{
  const {data}=await $host.get('api/type')
  return data;
}

export const fetchBrands=async ()=>{
  const {data}=await $host.get('api/brand')
  return data;
}

export const fetch=async (what)=>{
  const {data}=await $host.get('api/'+what);
  return data;
}

export const createDevice=async (device)=>{
  const {data}=await $authHost.post('api/device', device);
  return data;
}

export const updateDevice=async (device)=>{
  const {data}=await $authHost.put('api/device', device);
  return data;
}

export const fetchDevices=async (typeId, brandId, page, limit=5, substr, instock)=>{
  const {data}=await $host.get('api/device', {params: {
    typeId, brandId, page, limit, substr: substr?.trim(), instock
  }});
  return data;
}

export const fetchDevicesExport=async ()=>{
  const {data}=await $authHost.get('api/device/export');
  return data;
}

export const fetchOneDevice=async (id)=>{
  const {data}=await $host.get('api/device/'+id)
  return data;
}

export const fetchBasketDevices=async ()=>{
  const {data}=await $authHost.get('api/basketdevice');
  return data;
}

export const createBasketDevice=async ({deviceId, count, addCount})=>{
  const {data}=await $authHost.post('api/basketdevice', {deviceId, count, addCount});
  return data;
}

export const deleteBasketDevice=async (id)=>{
  const {data}=await $authHost.delete('api/basketdevice/delete', {params: {id}});
  return data;
}

export const createRating=async (deviceId, rate)=>{
  const {data}=await $authHost.post('api/rating', {deviceId, rate});
  return data;
}

export const fetchRating=async (deviceId)=>{
  const {data}=await $host.get('api/rating/'+deviceId);
  return data;
}

export const fetchRate=async (deviceId)=>{
  const {data}=await $authHost.get('api/rating/user/'+deviceId);
  return data;
}