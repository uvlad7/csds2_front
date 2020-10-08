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
const Row = styled.div`
display: flex;
align-items: center;
gap: 1rem;
margin: 1 0rem
`

const FileItem = styled.li`
cursor: pointer;
`

export default ({ files, handleClick, text, onChangeText, fileName, onChangeFileName, onAdd, onUpdateFile, fileId, handleDelete }) => (
  <GappedRow>
    <ul list-style-type='none'>
      {files.map(file => {
        return <FileItem key={file} onClick={() => handleClick(file[1])}>
          <Row>
            <div>
              {file[0]}
            </div>
            <button onClick={() => handleDelete(file[1])} > Delete file </button>
          </Row>
        </FileItem>
      })}
      {
        <FileItem onClick={onAdd}>
          <button disabled={!text}>Add new file</button>
        </FileItem>
      }

    </ul>
    <div style={{'border': '2px solid black', 'padding': '2rem'}}>
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
      <button onClick={onUpdateFile} disabled={fileId ? null : true}> Update file</button>
    </div>

  </GappedRow >
);
