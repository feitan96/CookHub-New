import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = [
    "Budget-friendly",
    "Filipino",
    "High-protein",
    "Low-calorie",
    "Pork-based",
    "Vegan",
    "Chicken-based",
    "Italian",
  ];

type TagsDropdownProps = {
  handleTagClick: (tag: string) => void; // Specify the type of handleTagClick
};

const TagsDropdown: React.FC<TagsDropdownProps> = ({ handleTagClick }) => {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div
            key={tag}
            className="text-sm cursor-pointer"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
            <Separator className="my-2"/>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
  
  export default TagsDropdown;