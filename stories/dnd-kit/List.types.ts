import {UniqueIdentifier} from "@dnd-kit/core";

export interface IId {
  id: UniqueIdentifier;
}

export interface IHasRank {
  rank: string;
}

export interface IListItemData extends IId, IHasRank {
  name: string;
}

export interface ISortablePayload<TEntity extends IId> {
  prevEntity?: TEntity;
  entity: TEntity;
  nextEntity?: TEntity;
}