//import { useState } from 'react'
import '../styles/components.css';
import {useState} from 'react';


interface ZametkiProps {
  id: string;
  title: string;
  content: string;
  size: [number,number];
  dragListeners?: Record<string, unknown>;
  
}

function Zametki({id,title, content,size,dragListeners = {}}: ZametkiProps) {

  const [newContent,setNewContent] = useState(content);
  const [newTitle, setNewTitle] = useState(title);


  return (
    <section id={id} className="zametki" style={{width: `${size[0]}px`, height: `${size[1]}px`}}>
        
          <h2 {...dragListeners} 
          className="drag-handle"
          style={{ cursor: 'grab' }}> <textarea onChange={ (changed) => {setNewTitle(changed.target.value)}} value={newTitle} onMouseDown={(e) => e.stopPropagation()}/></h2>
          
          <textarea onChange={ (changed) => {setNewContent(changed.target.value)}} value={newContent}></textarea>
        
         
        
    </section>
  )
}

export default Zametki