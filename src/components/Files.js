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

const FileItem = styled.li`
cursor: pointer;
`

export default ({ files, handleClick, text, onChangeText, fileName, onChangeFileName, onAdd, onUpdateFile, fileId }) => (
  <GappedRow>
    <ul>
      {files.map(file => {
        return <FileItem key={file} onClick={() => handleClick(file)}>
          {file}
        </FileItem>
      })}
      {
        <FileItem onClick={onAdd}>
          Add new file
        </FileItem>
      }

    </ul>
    <div>
      <div>
        <input
          value={fileName}
          onChange={onChangeFileName}
        />
      </div>
      <div style={{ 'marginTop': '2rem' }}>
        <textarea
          value={text}
          onChange={onChangeText} />
      </div>
      <button onClick={onUpdateFile} disabled={!fileId}> Update file</button>
    </div>

  </GappedRow >
);
