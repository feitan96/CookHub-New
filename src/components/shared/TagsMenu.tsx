// TagsMenu.tsx

import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface TagsMenuProps {
  onTagClick: (tag: string) => void;
}

const TagsMenu: React.FC<TagsMenuProps> = ({ onTagClick }) => {
  const cuisines = [
    "Filipino",
    "Italian",
    "Japanese",
    "Mediterranean",
    "Indian",
    "Mexican",
    "Chinese",
    "Thai",
    "Greek",
    "French",
  ];

  const courses = [
    "Appetizer",
    "MainCourse",
    "SideDish",
    "Dessert",
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Snack",
  ];

  const ingredients = [
    "Vegetarian",
    "Seafood",
    "Chicken",
    "Beef",
    "Pork",
    "Vegan",
    "GlutenFree",
    "DairyFree",
    "LowCarb",
    "HighProtein",
  ];

  const themes = [
    "Holiday",
    "ComfortFood",
    "Summer",
    "Party",
    "QuickAndEasy",
    "FamilyFavorite",
    "DateNight",
    "Picnic",
    "BudgetFriendly",
  ];

  const renderMenuItems = (items: string[]) => {
    return items.map((item) => (
      <React.Fragment key={item}>
        <MenubarItem onClick={() => onTagClick(item)}>{item}</MenubarItem>
        <MenubarSeparator />
      </React.Fragment>
    ));
  };

  return (
    <Menubar className="flex-center gap-9 w-full max-w-5xl bg-black text-white">
      <MenubarMenu>
        <MenubarTrigger>Cuisine</MenubarTrigger>
        <MenubarContent>{renderMenuItems(cuisines)}</MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Course</MenubarTrigger>
        <MenubarContent>{renderMenuItems(courses)}</MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Ingredient</MenubarTrigger>
        <MenubarContent>{renderMenuItems(ingredients)}</MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>{renderMenuItems(themes)}</MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default TagsMenu;
