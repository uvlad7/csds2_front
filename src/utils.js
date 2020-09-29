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
  console.log('a')
  const binary_string = atob(str);
  const len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  console.log(bytes)
  return bytes;
}

export const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
