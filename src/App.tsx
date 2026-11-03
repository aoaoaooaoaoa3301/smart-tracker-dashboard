import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import './styles/App.css'
import { SortableCard } from './components/SortableCard';
import Zametki from './components/Zametki' // .tsx в импорте лучше не писать
import List from './components/List'

type CardType = 'zametki' | 'list';

interface BaseCard {
  id: string;
  title: string;
  type: CardType;
  size: number[];
}

interface ZametkiCard extends BaseCard {
  type: 'zametki';
  content: string; 
}

interface ListCard extends BaseCard {
  type: 'list';
  content: string[];
}


type Card = ZametkiCard | ListCard;


const cardsEx: Card[] = [
  { id: '1', type: 'zametki', size:[500,500], title: "Заметка 1", content: 'Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians' },
  { id: '2', type: 'zametki', size:[200,200], title: "Заметка 2", content: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians' },
  { id: '3', type: 'zametki', size:[200,200], title: "Заметка 3", content: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians' },
  { id: '4', type: 'list', size:[200,200], title: "Список 1", content: ['123', '321', '1234', '3124142'] },
  { id: '5', type: 'zametki', size:[200,200], title: "Заметка 5", content: 'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians.' },
  { id: '6', type: 'zametki', size:[800,400], title: "Заметка 6", content: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians' },
  { id: '7', type: 'zametki', size:[200,200], title: "Заметка 7", content: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians.' },
  { id: '8', type: 'zametki', size:[200,200], title: "Заметка 8", content: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet asd asdadasnd oasndo asnd oasndo ansdoasn odians iodnasod nasod nakod nasod nasod ians.' },
  { id: '9', type: 'zametki', size:[500,400], title: "Заметка 9", content: 'Lorem ipsum dolor sit amet...' },
  
];

function renderCardContent(item: Card): React.ReactNode {
  switch (item.type) {
    case 'zametki':
      return (
        <Zametki
          id={item.id}
          title={item.title} 
          content={item.content} 
          size={[item.size[0],item.size[1]]}
        />
      );
    case 'list':
      return (
        <List
          id={item.id}
          title={item.title} 
          content={item.content}
          size={[item.size[0],item.size[1]]}
        />
      );
    default:
      return null;
  }
}



function App() {

  const [cards, setCards] = useState<Card[]>(cardsEx);
  

  const AddNewCard = () =>{ 
    const newCard: Card = {
    id: `${cards.length + 1}`,  // ✅ уникальный ID
    type: 'list',
    size: [200, 200],
    title: "Новый список",
    content: ['123', '321', '1234', '3124142'],
    };
    console.log([...cards, newCard]);
    setCards((cardsIn) => [...cardsIn, newCard]);
  }

  // Сенсоры: мышь + клавиатура
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // перетаскивание начнётся только после движения на 5px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Обработчик окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    //console.log('DragEnd:', { active, over });
    if (over && active.id !== over.id) {
      
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        //console.log(' Индексы:', { oldIndex, newIndex });
        
        return arrayMove(items, oldIndex, newIndex);
        
      });
    }
  };


  return (
    <>
      <section id="header">
        <span>Dashboard</span>
      </section>

        
      <section id="main">
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        >
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          
          {cards.map((item) => (
            <SortableCard key={item.id} id={item.id}>
              {renderCardContent(item)}
            </SortableCard>
          ))}
          <div style={{width:`${cards[cards.length-1].size[0]}px`,height:`${cards[cards.length-1].size[1]}px`}} className='flex-center'>

          <button onClick={AddNewCard} className='btn-add-new-card'>+</button>
          </div>
          
          </SortableContext>
      </DndContext>
      </section>
        

      <section id="footer">
        <span>
          created by <a href="https://github.com/aoaoaooaoaoa3301">aoaoaoaoa</a>
        </span>
      </section>
    </>
  )
}

export default App