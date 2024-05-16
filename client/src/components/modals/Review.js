import React, {useState, useContext, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createReview, updateReview, fetchReviewsByUserIdAndDeviceId} from '../../http/deviceApi';
import {Context} from '../../index.js';
const manyHoursEditReview=24; 

const ReviewModal=({show, onHide, deviceId})=>{
  const {user, review}=useContext(Context);
  const [title, setTitle]=useState();
  const [body, setBody]=useState();
  const [existsReview, setExistsReview]=useState(false);
  const [canEditReview, setCanEditReview]=useState(true);

  useEffect(()=>{
    if (user.isAuth)
      fetchReviewsByUserIdAndDeviceId({userId: user.user.id, deviceId}).then(data=>{
        const rev=data?.rows[0];
        const dateNow=new Date();
        const createdReview=new Date(rev?.createdAt);
        const hoursPassed=(dateNow-createdReview) / (1000*60*60);
        //console.log(hoursPassed);
        setCanEditReview(hoursPassed<=manyHoursEditReview || !rev);
        setExistsReview(!!rev);
        setTitle(rev?.title);
        setBody(rev?.body);
      });
  }, [user.user.id, deviceId]);

  const addReview=()=>{
    if (!title?.trim()) { alert('Введите заголовок отзыва'); return};
    if (!body?.trim()) { alert('Введите текст отзыва'); return};
    if (existsReview) 
      updateReview({title: title.trim(), body: body.trim(), deviceId}).then(data=>{
        review.setFUpdate();
      }).catch(e=>alert(e.response.data.message));
    else 
      createReview({title: title.trim(), body: body.trim(), deviceId}).then(data=>{
        review.setFUpdate();
      }).catch(e=>alert(e.response.data.message));
    setExistsReview(true);
    onHide();
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {canEditReview ? 'Оставить отзыв' : 'Период редактирования истёк!'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user.isAuth ?
        <Form>
          <Form.Control
              placeholder='Введите заголовок' 
              value={title}
              onChange={e=>setTitle(e.target.value)}
          />
          <Form.Control
            placeholder='Введите текст отзыва'
            className='mt-2' 
            as="textarea" rows={3} 
            onChange={e=>setBody(e.target.value)}
            value={body}
          />
        </Form> 
        : <div style={{selfAlign: 'left'}}>Для того, чтобы оставить отзыв, войдите или зарегистрируйтесь.</div>}
      </Modal.Body>
      <Modal.Footer>
        {user.isAuth && canEditReview && 
          <Button variant='outline-success' 
            onClick={addReview}>
            {existsReview ? 'Обновить' : 'Отправить'} отзыв</Button>}
        <Button variant='outline-danger' onClick={()=>onHide()}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;