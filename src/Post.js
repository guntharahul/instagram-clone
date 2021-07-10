import React, { useState, useEffect, Fragment } from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  // console.log(comments);

  useEffect(() => {
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection('posts')
        .doc(props.postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              username: doc.data().username,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              id: doc.id,
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection('posts').doc(props.postId).collection('comments').add({
      text: comment,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

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

      {comments.length > 0 ? (
        <div className='post__comments'>
          {comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username} : </strong>
              {comment.text}
            </p>
          ))}
        </div>
      ) : (
        <p className='post__noComments'>no comments</p>
      )}
      {props.user && (
        <form onSubmit={postComment} className='post__commentBox'>
          <input
            className='post__inputComment'
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
            placeholder='Comment....'
            type='text'
          ></input>
          <button
            type='submit'
            className='post__commentButton'
            onSubmit={postComment}
            disabled={!comment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
