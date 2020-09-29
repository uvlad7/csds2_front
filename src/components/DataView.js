import React from 'react';

const styles = {
  container: {
  },
  key: {
    fontFamily: 'Courier',
    textAlign: 'center',
  },
};

export default ({ publicKey, privateKey, sessionKey }) => (
  <div style={styles.container}>
    <div style={styles.key}>
      Public: ({publicKey})
    </div>
    <div style={styles.key}>
      {/* Private: ({privateKey}) */}
    </div>
    {sessionKey && <div style={styles.key}>Session: {sessionKey}</div>}
  </div>
);
