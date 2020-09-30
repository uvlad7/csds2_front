import React from 'react';
import styled from 'styled-components'

const GappedRow = styled.div`
display: flex;
margin: 0px auto;
align-items: center;
justify-content: space-between;
gap: 1rem;
max-width: 50%
`

export default ({ files, handleClick, text, onChangeText, fileName, onChangeFileName }) => (
  <GappedRow>
    <ul>
      {console.log(files)}
      {files.map(file => {
        return <li key={file} onClick={() => handleClick(file)}>
          {file}
        </li>
      })}

    </ul>
    <div>
      <div>
        <input
          value={fileName}
          onChange={onChangeFileName}
        />
      </div>
      <div style={{'marginTop': '2rem'}}>
        <textarea
        value={text}
        onChange={onChangeText} />
    </div>
    </div>

  </GappedRow >
);
