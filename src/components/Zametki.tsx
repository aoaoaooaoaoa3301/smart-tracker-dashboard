//import { useState } from 'react'
import '../styles/components.css'
interface ZametkiProps {
  id: string;
  title: string;
  content: string;
}

function Zametki({id,title, content}: ZametkiProps) {

  return (
    <section id={id} className="zametki">
        
        <h2>{title}</h2>
        <p>{content}</p>
        
          <button className='btn-text-edit'>
            ✏️
          </button>
        
    </section>
  )
}

export default Zametki