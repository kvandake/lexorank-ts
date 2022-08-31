import React, {useMemo} from 'react';
import {LexoRank as LexoRankLib} from "../../lib";
import {ELexoRankVariant} from "./LexoRank.types";

interface Props {
  variant: ELexoRankVariant
}

const LexoRank: React.FC<Props> = ({variant}) => {
  const lexoRank = useMemo(() => {
    switch (variant) {
      case ELexoRankVariant.Min:
        return LexoRankLib.min().toString();
      case ELexoRankVariant.Middle:
        return LexoRankLib.middle().toString();
      case ELexoRankVariant.Max:
        return LexoRankLib.max().toString();
    }
  }, [variant]);

  return (
    <>
      {lexoRank}
    </>
  );
};

export default LexoRank;