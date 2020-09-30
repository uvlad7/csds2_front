import React from 'react';

const styles = {
  container: {
  },
  key: {
    fontFamily: 'Courier',
    textAlign: 'center',
  },
};

export default ({ files, handleClick }) => (
  <ul>
    { files.map(file => {
      return <li key={file} onClick={() => handleClick(file)}>
        {file}
      </li>
    })}
  </ul>
);
