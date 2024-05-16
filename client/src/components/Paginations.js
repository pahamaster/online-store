import React from 'react';
import {observer} from 'mobx-react-lite';
import {Pagination} from 'react-bootstrap';

const Paginations=observer(({pageCount, page, changePage})=>{
  const pages=[];
  for (let i=0; i<pageCount; i++) pages.push(i+1);
  return (
    <Pagination className='mt-3'>
      {pages.length>1 && pages.map(p=>
        <Pagination.Item
          key={p}
          active={p===page}
          onClick={()=>changePage(p)}
        >
          {p}
        </Pagination.Item>
      )}
    </Pagination>
  );
});

export default Paginations;