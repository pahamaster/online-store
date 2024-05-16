import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import {observer} from 'mobx-react-lite';
import {Context} from './index';
import {check} from './http/userApi';
import {fetchBasketDevices} from './http/deviceApi';
import {Spinner} from 'react-bootstrap';

const App=observer(()=> {
  const {user, basket}=useContext(Context);
  const [loading, setLoading]=useState(true);
  useEffect(()=>{
    check().then(data=>{
      user.setUser(data);
      user.setIsAuth(true);
      return fetchBasketDevices(user.id)
    }).then(data=>{
      basket.setBasketDevices(data.rows);
      basket.setCount(data.count);
    }).finally(()=>setLoading(false));
  },[user, basket]);
  if (loading) {
    return <Spinner animation='grow'/>
  }
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
