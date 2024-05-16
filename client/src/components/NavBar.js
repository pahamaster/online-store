import React, {useContext} from 'react';
import {Context} from '../index';
import {NavLink, useHistory} from 'react-router-dom';
import {SHOP_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, BASKET_ROUTE, MYORDERS_ROUTE} from '../utils/consts.js';
import {Button, Container, Navbar, Nav, Image} from 'react-bootstrap';
import {observer} from 'mobx-react-lite';
import basketImg from '../assets/basket.png';

const NavBar=observer(()=>{
  const history=useHistory();
  const {user, basket, order}=useContext(Context);
  const logOut=()=>{
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
    basket.setCount(0);
    //basket.setDevices([]);
    history.push(SHOP_ROUTE);
  }
  return (
    <Navbar bg="secondary" variant="light">
    <Container>
      <NavLink style={{color: 'black'}} to={SHOP_ROUTE}>КупиДевайс</NavLink>
      {user.isAuth ?
        <Nav className="ml-auto">
          {user?.user?.role==='ADMIN' && <Button variant={'outline-light'} onClick={()=>{ history.push(ADMIN_ROUTE)}}>Админ панель</Button>}
          <Button variant={'outline-light'} className='ms-2 ml-2' onClick={()=>{order.setPage(1); history.push(MYORDERS_ROUTE)}}>Мои заказы</Button>
          <Button variant={'outline-light'} className='ms-2' onClick={()=>{ history.push(BASKET_ROUTE)}}>
            <Image width={18} height={18} src={basketImg}/>
            {' '+basket.count+' '}Корзина
          </Button>
          <div class='ms-4 d-flex align-items-center'>{user.user.email}</div>
          <Button variant={'outline-light'} className='ms-2 ml-2' onClick={logOut}>Выйти</Button>
        </Nav>
        :
        <Nav className="ml-auto">
          <Button variant='outline-light' onClick={()=>{ history.push(BASKET_ROUTE)}}>
            <Image width={18} height={18} src={basketImg}/>
            {' '+basket.count+' '}Корзина
          </Button>
          <Button variant='outline-light' className='ms-2' onClick={()=>history.push(LOGIN_ROUTE)}>Авторизация</Button>
        </Nav>
      }
    </Container>
  </Navbar>
  );
});

export default NavBar;