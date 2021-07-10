import './App.css';
import Post from './Post';
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#f0f0f0',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // when there is any change in auth happens this below function is fired (even if the page refresh too)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged in
        // console.log(authUser);
        setUser(authUser);
      } else {
        //User has logged Out
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        //every time a new post is added this will function fired off.
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //Sign Up User
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });
    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup' onSubmit={signUp}>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='instagram'
              ></img>
            </center>
            <Input
              placeholder='Username'
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            ></Input>
            <Input
              placeholder='Email'
              type='text'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></Input>
            <Input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></Input>
            <Button variant='contained' color='primary' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signin' onSubmit={signIn}>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='instagram'
              ></img>
            </center>

            <Input
              placeholder='Email'
              type='text'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></Input>
            <Input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></Input>
            <Button variant='contained' color='primary' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram'
        ></img>
        {user ? (
          <Button
            variant='contained'
            color='primary'
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div className='app__loginContainer'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setOpenSignIn(true);
              }}
            >
              Sign In
            </Button>
            <Button variant='contained' color='primary' onClick={handleOpen}>
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        {posts.map((post) => (
          <Post key={post.id} postInfo={post.post}></Post>
        ))}
      </div>

      <InstagramEmbed
        url='https://www.instagram.com/p/CRHO3XuBDIM/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      ></InstagramEmbed>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ) : (
        <h4>Login to Post</h4>
      )}
    </div>
  );
}

export default App;
