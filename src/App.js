import './App.css';
import Post from './Post';
import React, { useState, useEffect } from 'react';
import { db } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    db.collection('posts').onSnapshot((snapshot) => {
      //every time a new post is added this will function fired off.
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className='app'>
      <div className='app__headerImage'>
        <img
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram'
        ></img>
      </div>
      {posts.map((post) => (
        <Post key={post.id} postInfo={post.post}></Post>
      ))}
    </div>
  );
}

export default App;
