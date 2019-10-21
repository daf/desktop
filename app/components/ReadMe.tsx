import * as React from 'react'

import SimpleMDE from 'react-simplemde-editor'

interface ReadmeProps {
  foo?: string
}

const Readme: React.FunctionComponent<ReadmeProps> = () => {
  return (
    <SimpleMDE />
  )
}

export default Readme
