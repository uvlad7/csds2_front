import React, { useState } from 'react';
import logo from './logo.svg';
import NodeRSA from 'node-rsa'
import './App.css';
import DataView from './components/DataView'
import LoginForm from './components/LoginForm'
import Files from './components/Files'
import crypto from 'crypto'

import { request, api, str2ab, getRequest } from './utils';

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
  const [key, setKey] = useState(null)
  const [files, setFiles] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileId, setFileId] = useState(null)

  const algorithm = 'aes-256-cfb';

  const encryptText = (keyStr, text) => {
    const hash = crypto.createHash('sha256');
    console.log(hash)
    hash.update(keyStr);
    console.log(keyStr)
    const keyBytes = hash.digest();
    console.log(keyBytes)
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, keyBytes, iv);
    console.log('IV:', iv);
    let enc = [iv, cipher.update(text, 'utf8')];
    enc.push(cipher.final());
    return Buffer.concat(enc).toString('base64');
  }

  const decryptText = (keyStr, text) => {
    const hash = crypto.createHash('sha256');
    hash.update(keyStr);
    const keyBytes = hash.digest();

    const contents = Buffer.from(text, 'base64');
    const iv = contents.slice(0, 16);
    const textBytes = contents.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, keyBytes, iv);
    let res = decipher.update(textBytes, '', 'utf8');
    res += decipher.final('utf8');
    return res;
  }

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

  const buf2hex = (buffer) => { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  const generateKeys = async () => {
    try {
      const key = new NodeRSA().generateKeyPair()
      key.setOptions({ encryptionScheme: 'pkcs1' })
      setKey(key)
      const publicKey = key.exportKey('pkcs8-public-pem');
      console.log(publicKey)
      const privateKey = key.exportKey('pkcs1-pem');
      console.log(privateKey)
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      // console.log(publicKey)

      // crypto.subtle.generateKey(
      //   {
      //     name: "RSA-OAEP",
      //     modulusLength: 2048, //can be 1024, 2048, or 4096
      //     publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      //     hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      //   },
      //   true, //whether the key is extractable (i.e. can be used in exportKey)
      //   ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
      // )
      //   .then(function (key) {
      //     //returns a keypair object
      //     setPrivateKey(key.privateKey)
      //     crypto.subtle.exportKey(
      //       "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      //       key.publicKey //can be a publicKey or privateKey, as long as extractable was true
      //     ).catch(function (err) {
      //       console.error(err);
      //     }).then(function (keydata) {
      //       //returns the exported key data
      //       setPublicKey(keydata);
      //     })
      //       .catch(function (err) {
      //         console.error(err);
      //       });
      //   })
      //   .catch(function (err) {
      //     console.error(err);
      //   });
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

  const decrypt = async (encrypted) => {
    key.setOptions({ encryptionScheme: 'pkcs1' })
    setSessionKey(key.decrypt(encrypted, 'utf-8'))
  }

  const login = async () => {
    try {
      const { data, headers } = await request(api.login, 'POST', {
        user: {
          email: user,
          password,
        },
        rsa_pub: publicKey,
      });
      console.log(data)
      const { session_key } = data
      const token = headers.get('Authorization')
      // const { decrypted } = await request(api.private.rsaDecrypt, 'post',{
      //   key: privateKey,
      //   data: sessionKey,
      // });
      // console.log('decrypted sessionKey: ', decrypted);
      setToken(token)
      decrypt(session_key)
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
        rsa_pub: publicKey,
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
    const { data } = await getRequest(api.getData, {}, token);
    console.log(data)
    // console.log('encrypted: ', encrypted);

    // const { text } = await request(api.private.aesDecrypt, { sessionKey, encrypted });
    // setText(text)
    setFiles(data)
    setRsaOpened(false)
  };

  const addFile = async (name, content) => {
    // try {
      const { data, headers } = await request(api.createFile, 'POST', {
        filename: name,
        text: encryptText(sessionKey, content)
      }, token)
      getData()
    // } catch (err) {
    //   handleError(err);
    // }
  }

  const updateFile = async (name, content, fileId) => {
    try {
      const { data, headers } = await request(`${api.updateFile}/${fileId}`, 'PATCH', {
        filename: name,
        text: encryptText(sessionKey, content)
      }, token)
      getData()
    } catch (err) {
      handleError(err);
    }
  }

  const deleteFile = async (name, content, fileId) => {
    try {
      const { data, headers } = await request(`${api.updateFile}/${fileId}`, 'DELETE', {
        filename: name,
        text: encryptText(sessionKey, content)
      }, token)
      getData()
    } catch (err) {
      handleError(err);
    }
  }

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
      {true && (
        <Files files={files || []}
          onAdd={() => addFile(fileName, text)}
          text={text}
          fileName={fileName}
          onChangeFileName={(e)=>setFileName(e.target.value)}
          onChangeText={(e)=>setText(e.target.value)}>

        </Files>
        // <ScrollView style={styles.textWrapper}>
        //   <Text>{text}</Text>
        // </ScrollView>
      )}
      <button
        onClick={generateKeys}
        style={{ marginTop: '2rem' }}
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
