import React, {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import {ListGroup} from 'react-bootstrap';

const TypeBar=observer(()=>{
  const {device}=useContext(Context);
  return (
    <ListGroup className='mt-2'>
      {device?.barTypes?.map((type)=>
        <ListGroup.Item
          style={{cursor: 'pointer'}}
          active={type.id===device.selectedType?.id}
          onClick={()=>device.setSelectedType(device?.selectedType?.id===type.id ? (null, 1)
            : (device?.types?.find(i=>i.id===type.id)), 1)} 
          key={type.id}
        >
          {type.name}
        </ListGroup.Item>
      )}
    </ListGroup>
  );
});

export default TypeBar;