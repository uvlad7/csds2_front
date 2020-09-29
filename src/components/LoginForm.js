import React from 'react';
import styled from 'styled-components'

const Row = styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: 1rem;
`

const styles = {
  labelWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 17,
  },
  input: {
    width: 200,
    margin: 2.5,
    padding: 7.5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
  },
};

export default ({ user, password, onChangeLogin, onLogin, onSignUp, onChangePassword }) => (
  <div style={{ maxWidth: '50%', margin: '0 auto' }}>
    <div style={styles.labelWrapper}>
      <div style={styles.label}>login:</div>
    </div>
    <input value={user} style={styles.input} onChange={onChangeLogin} type='email' />
    <div style={styles.labelWrapper}>
      <div style={styles.label}>password:</div>
    </div>
    <input
      type='password'
      value={password}
      style={styles.input}
      onChange={onChangePassword}
    />
    <Row>
      <button onClick={onLogin}>
        Login
      </button>
      <button onClick={onSignUp}>
        Sign up
      </button>
    </Row>
  </div>
);
