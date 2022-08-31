import React, {useMemo} from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {UniqueIdentifier} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import ListItem from "./ListItem";
import {IListItemData} from "../List.types";

interface Props {
  id: UniqueIdentifier
  data: IListItemData;
}

const SortableListItem: React.FC<Props> = ({id, data}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({id: id});

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }), [transform, transition]);

  return <ListItem ref={setNodeRef} style={style} {...attributes} {...listeners} data={data} />;
};

export default SortableListItem;