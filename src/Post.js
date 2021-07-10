import React from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';

const Post = (props) => {
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar'>{props.postInfo.username[0]}</Avatar>
        <h3 className='post__header'>{props.postInfo.username}</h3>
      </div>
      <img
        className='post__image'
        src={props.postInfo.imageUri}
        alt='post'
      ></img>
      <h5 className='post__text'>
        <strong>{props.postInfo.username} :</strong> {props.postInfo.caption}
      </h5>
    </div>
  );
};

export default Post;
