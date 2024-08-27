"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import React, { Children, useMemo, useState } from "react";
import { useEcs } from "@/context/EcsContext";
import SAMPLE_MODELS, {CATEGORIES, type IModel} from "@/data/models";

const FIXED_ITEMS = Object.values(SAMPLE_MODELS);
const MIN_NUM_ITEMS = 10;

interface ItemSelectorTrigger {
  onClick: () => void;
  open?: boolean;
}

const ItemSelectorTrigger: React.FC<ItemSelectorTrigger> = (props) => {
  const { open, onClick } = props;

  return (
    <Button
      variant="secondary"
      size="default"
      onClick={onClick}
      className="mb-4"
    >
      <ChevronDown
        color="black"
        size={20}
        className={`${open ? "" : "rotate-180"} transition-all`}
      />
    </Button>
  );
};

const EmptyItemSlot: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[100px] flex items-center justify-center">
      <div className="rounded-full bg-gray-900 border-black border border-dashed opacity-20 w-3 h-3" />
    </div>
  );
};

interface SelectableItemProps {
  item: IModel;
}

const SelectableItem: React.FC<SelectableItemProps> = (props) => {
  const { item } = props;
  const { addItem } = useEcs();

  const handleOnSelect = () => {
    addItem(item);
  }

  return <button onClick={handleOnSelect} className="w-full h-full max-h-[100px] flex items-center justify-center">
    <img src={item.png} className="w-full h-full object-contain"/>
  </button>;
};

const ItemMenuTabs: React.FC<{
  filter: CATEGORIES;
  setFilter: (
    filter: CATEGORIES
  ) => void;
}> = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-nowrap w-full overflow-x-auto gap-2 px-3 pt-2 pb-3 bg-gray-100">
      {Object.values(CATEGORIES).map((tab) => (
        <Button
          key={tab}
          variant={filter === tab ? "default" : "outline"}
          onClick={() =>
            setFilter(
              tab as CATEGORIES
            )
          }
          className="flex-shrink-0 font-bold uppercase"
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

const ItemMenu: React.FC = () => {
  const [filter, setFilter] = useState<CATEGORIES>(CATEGORIES.COASTER);

  const items = useMemo(() => FIXED_ITEMS.filter((item) => {
    console.log(item.category, filter);
    return item.category === filter;
  }), [filter]);

  const fillWithEmptySlots = (items: typeof FIXED_ITEMS) => {
    if (items.length < MIN_NUM_ITEMS) {
      const emptySlots = MIN_NUM_ITEMS - items.length;

      return [
        ...items.map((item, i) => (
          // TODO: fix key
          <SelectableItem key={i} item={item} />
        )),
        ...Array(emptySlots).fill(<EmptyItemSlot />),
      ];
    }

    return items.map((item, i) => (
      // TODO: fix key
      <SelectableItem key={i} item={item} />
    ));
  };

  const itemsAsElements = useMemo(
    () => Children.toArray(fillWithEmptySlots(items)),
    [items]
  );

  return (
    <section className="flex items-start flex-col overflow-hidden w-full h-full rounded-t-xl">
      <ItemMenuTabs filter={filter} setFilter={setFilter} />
      <div className="grid grid-cols-4 w-full max-h-[200px] lg:max-h-full overflow-y-auto bg-white bg-opacity-90 gap-4">
        {itemsAsElements}
      </div>
    </section>
  );
};

const ItemSelector: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center max-w-[500px]">
      <ItemSelectorTrigger open={open} onClick={() => setOpen(!open)} />
      {open && <ItemMenu />}
    </div>
  );
};

export default ItemSelector;
