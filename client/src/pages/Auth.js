import React, {useState, useContext} from 'react';
import {Container, Form, Button, Row, Card} from 'react-bootstrap';
import {NavLink, useLocation} from 'react-router-dom';
import {REGISTRATION_ROUTE, LOGIN_ROUTE} from '../utils/consts';
import {registration, login} from '../http/userApi';
import {createBasketDevice} from '../http/deviceApi';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import {useHistory} from 'react-router-dom';
import {SHOP_ROUTE} from '../utils/consts';
import {getLocalBasketDevices, setLocalBasketDevices} from '../utils/utils';

const Auth=observer(()=>{
  const {user}=useContext(Context);
  const location=useLocation();
  const isLogin=location.pathname===LOGIN_ROUTE;
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const history=useHistory();
  
  const click=async ()=>{
    let bDevices=getLocalBasketDevices();
    try {
      let data;
      if (isLogin) data=await login(email, password);
      else data=await registration(email, password);
      user.setUser(data);
      user.setIsAuth(true);
      for (const item of bDevices) 
        await createBasketDevice({deviceId: item.deviceId, addCount: item.count});
      setLocalBasketDevices([]);
      history.push(SHOP_ROUTE);
    } catch (e) {
      alert(e?.response?.data.message || e);
    }
  }

  return (
    <Container 
      className='d-flex justify-content-center align-items-center'
      style={{height: window.innerHeight-54}}>
        <Card style={{width: 600}} className='p-5'>
          <h2 className='m-auto'>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
          <Form className='d-flex flex-column'>
            <Form.Control
              type='email'
              className='mt-2'
              placeholder='Введите ваш Email...'
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
            <Form.Control
              className='mt-2'
              placeholder='Введите пароль...'
              type='password'
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
            <Row style={{textAlign: 'center'}} className="d-flex flex-row justify-content-between mt-3">
              {
                isLogin ?
                <div style={{width: 'auto'}}>
                  Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь</NavLink>
                </div>
                :
                <div style={{width: 'auto'}}>
                  Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
                </div>
              }
              <Button 
                style={{width: 'auto'}}
                variant={'outline-success'}
                onClick={click}
              >
                {isLogin ? 'Войти' : 'Регистрация'}
              </Button>
            </Row>
          </Form>
        </Card>
    </Container>
  )
});

export default Auth;