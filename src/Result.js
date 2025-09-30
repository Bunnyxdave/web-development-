import React from 'react'

const Result = ({result}) => {
  return (
    <div dangerouslySetInnerHTML={{__html: result}}className='resultdiv' />
  )
}

export default Result