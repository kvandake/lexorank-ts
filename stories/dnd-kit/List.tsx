import React, {useCallback, useState} from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DragEndEvent, DragStartEvent} from "@dnd-kit/core/dist/types";
import ListItem from "./components/ListItem";
import SortableListItem from "./components/SortableListItem";
import {IListItemData} from "./List.types";
import {createSortablePayloadByIndex, defaultItems, getBetweenRankAsc, sortByLexoRankAsc} from "./List.helpers";

interface Props {
}

const List: React.FC<Props> = () => {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState<IListItemData[]>(defaultItems());
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    }),
    useSensor(TouchSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const {active} = event;
    setActiveId(active.id);
  }, [setActiveId])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;
    if (active.id !== over?.id) {
      setItems((oldItems) => {
        // 1. find prev, current, next items
        const sortablePayload = createSortablePayloadByIndex(oldItems, event);
        // 2. calculate new rank
        const newRank = getBetweenRankAsc(sortablePayload);
        const newItems = [...oldItems];
        const currIndex = oldItems.findIndex(x => x.id === sortablePayload.entity.id);
        // 3. replace current rank
        newItems[currIndex] = {...newItems[currIndex], rank: newRank.toString()} as IListItemData;
        // 4. sort by rank
        return newItems.sort(sortByLexoRankAsc);
      });
    }

    setActiveId(null);
  }, [])

  const getItemData = useCallback((id: UniqueIdentifier) => {
    return items.find(x => x.id === id);
  }, [items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableListItem key={item.id} id={item.id} data={item}/>
        ))}
      </SortableContext>
      <DragOverlay>{activeId ? <ListItem id={activeId} data={getItemData(activeId)}/> : null}</DragOverlay>
    </DndContext>
  );
};

export default List;