import React, { useState } from 'react';
import logo from './logo.svg';
import { Crypt, RSA } from 'hybrid-crypto-js';


import './App.css';
import DataView from './components/DataView'
import LoginForm from './components/LoginForm'
import { request, api, str2ab } from './utils';

function App() {
  const [publicKey, setPublicKey] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [user, setUser] = useState('admin')
  const [password, setPassword] = useState('')
  const [sessionKey, setSessionKey] = useState(null)
  const [rsaOpened, setRsaOpened] = useState(false)
  const [text, setText] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const handleError = ({ status, error }) => {
    if (status === 401) {
      setSessionKey(null)
    }
    setText(null)
    setError(error)
  };

  const handleRsaSectionTogle = () => {
    setRsaOpened(e => !e)
    setError(null)
  };

  const generateKeys = async () => {
    try {
      crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, //can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
    )
    .then(function(key){
        //returns a keypair object
        setPrivateKey(key.privateKey)
        crypto.subtle.exportKey(
          "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
          key.publicKey //can be a publicKey or privateKey, as long as extractable was true
      )
      .then(function(keydata){
          //returns the exported key data
          setPublicKey(keydata);
      })
      .catch(function(err){
          console.error(err);
      });
    })
    .catch(function(err){
        console.error(err);
    });      
      setText(null)
      setSessionKey(null)
      // setPublicKey({ e, n })
      // setPrivateKey({ d, n })
      setRsaOpened(false)
      setError(null)
    } catch (err) {
      handleError(err);
    }
  };

  const decrypt = (encrypted) => {

    // crypto.subtle.decrypt(
    //   {
    //     name: "RSA-OAEP"
    //   },
    //   privateKey,
    //   str2ab(encrypted)
    // ).then((plain) => console.log(plain));
    return encrypted
  }

  const login = async () => {
    try {
      const { data, headers } = await request(api.login, 'POST', {
        user: {
          email: user,
          password,
        },
        public_key: publicKey,
      });
      const { session_key } = data
      const token = headers.get('Authorization')
      // const { decrypted } = await request(api.private.rsaDecrypt, 'post',{
      //   key: privateKey,
      //   data: sessionKey,
      // });
      // console.log('decrypted sessionKey: ', decrypted);
      setToken(token)
      setSessionKey(decrypt(session_key))
      setError(null)
      setPassword('')
    } catch (err) {
      handleError(err);
    }
  };

  const signup = async () => {
    try {
      const { data, headers } = await request(api.signUp, 'POST', {
        user: {
          email: user,
          password,
          password_confirmation: password
        },
        public_key: publicKey,
      });
      const { session_key } = data
      const token = headers.get('Authorization')

      setToken(token)
      setSessionKey(decrypt(session_key))
      setError(null)
      setPassword('')
    } catch (err) {
      handleError(err);
    }
  };

  const getData = async () => {
    try {
      const { files } = await request(api.getData, 'POST', { }, token);
      console.log('encrypted: ', encrypted);

      const { text } = await request(api.private.aesDecrypt, { sessionKey, encrypted });
      setText(text)
      setRsaOpened(false)
    } catch (err) {
      handleError(err);
    }
  };

  const hasRsaKeys = publicKey && privateKey;
  const showText = !!text && !rsaOpened;
  const showLogin = hasRsaKeys && !rsaOpened && !sessionKey;
  return (

    <div className="App" >
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {showLogin && (
        <LoginForm
          {...{ user, password }}
          onChangeLogin={e => setUser(e.target.value)}
          onChangePassword={e => setPassword(e.target.value)}
          onLogin={login}
          onSignUp={signup}
        />
      )}
      {sessionKey && (
        <div> A </div>
          // <ScrollView style={styles.textWrapper}>
          //   <Text>{text}</Text>
          // </ScrollView>
        )}
      <button
        onClick={generateKeys}
      >
        {`${hasRsaKeys ? 'Reg' : 'G'}enerate rsa keys`}
      </button>

      {sessionKey && <button onClick={getData}> Get data </button>}
      {/* {hasRsaKeys && <DataView
        publicKey={publicKey}
        privateKey={privateKey}
        sessionKey={sessionKey}
      />} */}
    </div>
  );
}

export default App;
