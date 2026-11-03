import '../styles/components.css'

interface ListProps{
  id:string;
  title:string;
  content:string[];
  size:number[];
  dragListeners?: Record<string, unknown>;

}

function List({id,title,content,size,dragListeners = {}}:ListProps) {


  return (
    <section id={id} className="list" style={{width: `${size[0]}px`, height: `${size[0]}px`}}>
        <h2
        {...dragListeners} 
        
        className="drag-handle"
        style={{ cursor: 'grab' }}
        >{title}</h2>
        <ul>
          {content.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
    </section>
  )
}

export default List