import { useState, useEffect, useRef } from 'react';
import '../styles/components.css';

interface ListProps {
  id: string;
  title: string;
  content: string[]; // Начальные текстовые строки
  size: [number,number];    // [width, height] в пикселях
  dragListeners?: Record<string, unknown>;
}

interface ListItem {
  id: string;
  value: string;
}

// Кастомный хук для управления историей изменений (Undo/Redo)
function useListHistory(initialState: ListItem[]) {
  const [present, setPresent] = useState(initialState);
  const pastRef = useRef<ListItem[][]>([]);
  const futureRef = useRef<ListItem[][]>([]);

  const updateState = (newPresent: ListItem[]) => {
    pastRef.current.push(present);
    futureRef.current = []; // Очищаем историю Redo при новом действии
    setPresent(newPresent);
  };

  const undo = () => {
    if (pastRef.current.length === 0) return present;
    const previous = pastRef.current.pop()!;
    futureRef.current.push(present);
    setPresent(previous);
    return previous;
  };

  const redo = () => {
    if (futureRef.current.length === 0) return present;
    const next = futureRef.current.pop()!;
    pastRef.current.push(present);
    setPresent(next);
    return next;
  };

  return { present, updateState, undo, redo };
}

function List({ id, title, content, size, dragListeners = {} }: ListProps) {
  // Превращаем массив строк в массив объектов с уникальными ID при монтировании
  const initialItems = useRef(
    content.map((text) => ({ id: crypto.randomUUID(), value: text }))
  );

  const { present: items, updateState: setItems, undo, redo } = useListHistory(initialItems.current);
  
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Синхронизация фокуса при изменении структуры списка
  useEffect(() => {
    if (focusIndex !== null && inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
      setFocusIndex(null);
    }
  }, [focusIndex, items]);

  // Единая логика для отката изменений (Undo / Redo)
  const executeUndoRedo = (e: React.KeyboardEvent) => {
    const isZ = e.key.toLowerCase() === 'z';
    const isY = e.key.toLowerCase() === 'y';
    
    e.preventDefault();
    e.stopPropagation(); // Важно: предотвращаем нативный откат текста инпута браузером

    let updatedItems = items;
    if (isZ) {
      if (e.shiftKey) {
        updatedItems = redo(); // Ctrl + Shift + Z
      } else {
        updatedItems = undo(); // Ctrl + Z
      }
    } else if (isY) {
      updatedItems = redo(); // Ctrl + Y
    }

    if (updatedItems.length > 0) {
      setFocusIndex(Math.min(focusIndex ?? 0, updatedItems.length - 1));
    }
  };

  // Изменение текста внутри инпута
  const handleTextChange = (index: number, value: string) => {
    const newItems = items.map((item, i) => (i === index ? { ...item, value } : item));
    setItems(newItems);
  };

  // Логика клавиш Enter, Backspace и Ctrl+Z внутри инпутов
  const handleInputKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const isZ = e.key.toLowerCase() === 'z';
    const isY = e.key.toLowerCase() === 'y';
    const isCtrl = e.ctrlKey || e.metaKey;

    // Перехватываем Ctrl+Z / Ctrl+Y прямо на инпуте, чтобы не ломалась структура списка
    if (isCtrl && (isZ || isY)) {
      executeUndoRedo(e);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const newRow = { id: crypto.randomUUID(), value: '' };
      const newItems = [
        ...items.slice(0, index + 1),
        newRow,
        ...items.slice(index + 1)
      ];
      setItems(newItems);
      setFocusIndex(index + 1); // Переводим фокус на созданную строку

      // Автоскролл к созданному инпуту
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 0);
    }

    if (e.key === 'Backspace' && items[index].value === '') {
      e.preventDefault();
      if (items.length > 1) { // Не удаляем последнюю оставшуюся строку
        const newItems = [...items.slice(0, index), ...items.slice(index + 1)];
        setItems(newItems);
        setFocusIndex(index > 0 ? index - 1 : 0); // Фокус на предыдущую строку
      }
    }
  };

  return (
    <section
      id={id} 
      className="list" 
      style={{
        width: `${size[0]}px`, 
        height: `${size[1]}px`,
      }}
    >
      <h2
        {...dragListeners}
        className="drag-handle"
      >
        {title}
      </h2>

      {/* Контейнер для скролла контента */}
      <div 
        ref={scrollContainerRef}
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', // ИСПРАВЛЕНО: теперь скролл работает корректно в рамках flex-структуры
          overflowX: 'hidden',
          width: '100%' 
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%'}}>
          {items.map((item, index) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', width: '100%',gap: '0.5rem'}}>
              <span style={{ paddingLeft: '10px', userSelect: 'none' }}>●</span>
              <input
                type="text"
                ref={(el) => { inputRefs.current[index] = el; }}
                value={item.value}
                onChange={(e) => handleTextChange(index, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(index, e)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default List;
