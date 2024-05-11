

import React from 'react'

const Container = ({children, className} : {children:React.ReactNode, className?:string}) => {
  return (
    <div className={`${className} max-w-[1920px] w-full mx-auto lg:px-10 px-4 py-4`}>
        {children}
    </div>
  )
}

export default Container