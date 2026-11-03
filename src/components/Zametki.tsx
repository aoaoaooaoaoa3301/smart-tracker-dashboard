//import { useState } from 'react'
import '../styles/components.css';
import {useState} from 'react';


interface ZametkiProps {
  id: string;
  title: string;
  content: string;
  size: number[];
  dragListeners?: Record<string, unknown>;
  
}

function Zametki({id,title, content,size,dragListeners = {}}: ZametkiProps) {

  const [newContent,setNewContent] = useState(content);


  return (
    <section id={id} className="zametki" style={{width: `${size[0]}px`, height: `${size[1]}px`}}>
        <div>
          <h2 {...dragListeners} 
          
          className="drag-handle"
          style={{ cursor: 'grab' }}>{title}</h2>
          <textarea onChange={ (changed) => {setNewContent(changed.target.value)}} style={{width: `${size[0] - 8*2}px`, height: `${size[1] - 32*2}px`}} value={newContent}></textarea>
        </div>
         
        
    </section>
  )
}

export default Zametki