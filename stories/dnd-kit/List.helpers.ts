import {IHasRank, IId, IListItemData, ISortablePayload} from "./List.types";
import {LexoRank} from "../../lib";
import {DragEndEvent} from "@dnd-kit/core/dist/types";

export const defaultItems = (): IListItemData[] => {
  let currentRank = LexoRank.middle();
  const data: IListItemData[] = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      id: `${i}-id`,
      name: `Item ${i}`,
      rank: currentRank.toString()
    })
    currentRank = currentRank.genNext();
  }

  return data.sort(sortByLexoRankAsc);
}

export function sortByLexoRankAsc(a: IHasRank, b: IHasRank): number {
  if (!a.rank && b.rank) {
    return -1;
  }
  if (a.rank && !b.rank) {
    return 1;
  }

  if (!a.rank || !b.rank) {
    return 0;
  }

  return a.rank.localeCompare(b.rank);
}

export function createSortablePayloadByIndex<TEntity extends IId & IHasRank>(items: TEntity[], event: DragEndEvent): ISortablePayload<TEntity> {
  const {active, over} = event;
  const oldIndex = items.findIndex(x => x.id === active.id);
  const newIndex = items.findIndex(x => x.id === over?.id);
  let input: ISortablePayload<TEntity>;
  const entity = items[oldIndex];
  if (newIndex === 0) {
    const nextEntity = items[newIndex];
    input = {prevEntity: undefined, entity: entity, nextEntity: nextEntity} as ISortablePayload<TEntity>;
  } else if (newIndex === items.length - 1) {
    const prevEntity = items[newIndex];
    input = {prevEntity: prevEntity, entity: entity, nextEntity: undefined} as ISortablePayload<TEntity>;
  } else {
    const prevEntity = items[newIndex];
    const offset = oldIndex > newIndex ? -1 : 1;
    const nextEntity = items[newIndex + offset];
    input = {prevEntity: prevEntity, entity: entity, nextEntity: nextEntity} as ISortablePayload<TEntity>;
  }

  return input;
}

export function getBetweenRankAsc<TEntity extends IId & IHasRank>(payload: ISortablePayload<TEntity>): LexoRank {
  const {prevEntity, entity, nextEntity} = payload;
  let newLexoRank: LexoRank;
  if (!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).genPrev();
  } else if (!nextEntity && !!prevEntity) {
    newLexoRank = LexoRank.parse(prevEntity.rank).genNext();
  } else if (!!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).between(LexoRank.parse(prevEntity.rank));
  } else {
    newLexoRank = LexoRank.parse(entity.rank).genNext();
  }

  return newLexoRank;
}
