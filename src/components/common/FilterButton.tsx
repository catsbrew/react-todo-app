import type { FilterType } from '@/App';
import { Button } from '../ui';
import { FILTER_LABELS } from '@/constants/filter.constant';

interface Props {
  text: FilterType; // 'All' | 'Active' | 'Completed'
  isPressed: boolean;
  setFilter: (text: FilterType) => void;
}

function FilterButton({ text, isPressed, setFilter }: Props) {
  const koreanLabel = FILTER_LABELS[text];

  return (
    <Button
      type='button'
      variant={'outline'}
      className='cursor-pointer aria-pressed:!bg-foreground aria-pressed:!text-background'
      aria-pressed={isPressed}
      onClick={() => setFilter(text)}
    >
      {koreanLabel}
    </Button>
  );
}

export { FilterButton };
