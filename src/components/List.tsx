import '../styles/components.css'

interface ListProps{
  id:string;
  title:string;
  content:string[];
}

function List({id,title,content}:ListProps) {


  return (
    <section id={id} className="list">
        <h2>{title}</h2>
        <ul>
          {content.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
    </section>
  )
}

export default List