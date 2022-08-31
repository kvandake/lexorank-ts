import React, {forwardRef} from 'react';
import {UniqueIdentifier} from "@dnd-kit/core";
import {IListItemData} from "../List.types";

interface Props {
  id: UniqueIdentifier
  style?: any
  data: IListItemData;
}

const rootStyle = {
  border: '1px solid #ccc',
  height: '44px',
  width: '120px',
  marginTop: '8px',
  marginBottom: '8px',
  padding: '4px'
}

const nameStyle = {
  fontWeight: 'bold',
}

const rankStyle = {
  color: '#ccf',
}

const ListItem = forwardRef<any, Props>(({id, style, data, ...rest}, ref) => {
  return (
    <div {...rest} style={{...style, ...rootStyle}} ref={ref}>
      <div style={nameStyle}>{data.name}</div>
      <div style={rankStyle}>{data.rank}</div>
    </div>
  );
});

export default ListItem;