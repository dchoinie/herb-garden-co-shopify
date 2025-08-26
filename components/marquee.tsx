import React from 'react'

interface Props {
    children: React.ReactNode
    backgroundColor: string
    textColor: string
    speed?: number
}

const Marquee = ({ children, backgroundColor, textColor, speed = 20 }: Props) => {
  return (
    <div className={`${backgroundColor} ${textColor} overflow-hidden py-6`}>
              <div 
          className="flex whitespace-nowrap"
          style={{
            animation: `marquee ${speed}s linear infinite`,
            width: 'max-content'
          }}
        >          
          <div className="flex text-xl pr-12">
            {children}
          </div>
          <div className="flex text-xl pr-12">
            {children}
          </div>
          <div className="flex text-xl pr-12">
            {children}
          </div>
        </div>
    </div>
  )
}

export default Marquee