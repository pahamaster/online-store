import {$authHost, $host} from './index';
import jwt_decode from 'jwt-decode';

export const registration=async (email, password)=>{
  // const {data}=await $host.post('api/user/registration', {email, password, role: 'USER'});
  const {data}=await $host.post('api/user/registration', {email, password});
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
}

export const login=async (email, password)=>{
  const {data}=await $host.post('api/user/login', {email, password})
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
}

export const check=async ()=>{
    const {data}=await $authHost.get('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const fetch=async ()=>{
  const {data}=await $authHost.get('api/user');
  return data;
}

export const updateUser=async (freak)=>{
  const {data}=await $authHost.put('api/user', freak);
  return data;
}

export const fetchOneUser=async (id)=>{
  const {data}=await $authHost.get('api/user/'+id)
  return data;
}