import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPickerApp = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-tranparent border-none shadow-none drop-shadow-none mb-12"
      >
        <EmojiPicker
          theme={isDark ? Theme .DARK : Theme.LIGHT}
          onEmojiClick={(emojiData) => onChange(emojiData.emoji)}
          lazyLoadEmojis={true}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerApp;
