export const api = {
  login: 'login',
  signUp: 'signup',
  getData: 'text_files',
  private: {
    rsaGenerate: 'private/rsa/generate',
    rsaDecrypt: 'private/rsa/decrypt',
    aesDecrypt: 'private/aes/decrypt',
  },
};

const host = 'http://localhost:4000'

export const request = async (url, method, data, token=null) => {
  const response = await fetch(`${host}/${url}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(data),
  });
  const { status } = response;
  const json = await response.json();
  if (status !== 200) {
    const { error } = json;
    throw { status, error };
  }
  return { data: json.data, headers: response.headers };
};

export const str2ab = (str) => {
  var buff = new ArrayBuffer(str.length * 2);
  var view = new Uint16Array(buff);
  for ( var i=0, l=str.length; i<l; i++) {
   view[i] = str.charCodeAt(i);
  }
  return buff;
 }

export const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
