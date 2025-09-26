import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Checkbox, Input, Label } from '../ui';

interface Props {
  id: string;
  title: string;
  completed: boolean;
  onToggleCompleted: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newTitle: string) => void;
}

function Todo({
  id,
  title,
  completed = false,
  onToggleCompleted,
  onDeleteTodo,
  onEditTodo,
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(title);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEditTodo(id, newName);
    setIsEditing(false);
  };

  const editingTemplate = (
    <form onSubmit={handleSubmit}>
      <div className='mb-2'>
        <div className='grid gap-1.5 font-normal w-full'>
          <Input
            type='text'
            className='outline-none w-full py-5 rounded-lg'
            value={newName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
          />
        </div>
      </div>
      <div className='flex w-full space-x-2'>
        <Button
          type='button'
          variant={'destructive'}
          className='flex-1 cursor-pointer outline-none border-none'
          onClick={() => setIsEditing(false)}
        >
          취소
        </Button>
        <Button
          variant={'outline'}
          type='button'
          className='flex-1 cursor-pointer outline-none border-none'
        >
          저장
        </Button>
      </div>
    </form>
  );

  const viewTemplate = (
    <>
      <div>
        <Label
          className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'
          htmlFor={`todo-${id}`}
        >
          <Checkbox
            id={`todo-${id}`}
            className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700/50'
            defaultChecked={completed}
            onCheckedChange={() => onToggleCompleted(id)}
          />
          <div className='grid gap-1.5 font-normal'>
            <p className='text-sm leading-none font-medium'>{title}</p>
          </div>
        </Label>
      </div>
      <div className='flex w-full space-x-2'>
        <Button
          type='button'
          variant={'outline'}
          className='flex-1 cursor-pointer outline-none border-none'
          onClick={() => setIsEditing(true)}
        >
          수정
        </Button>
        <Button
          type='button'
          variant={'destructive'}
          className='flex-1 cursor-pointer outline-none border-none'
          onClick={() => onDeleteTodo(id)}
        >
          삭제
        </Button>
      </div>
    </>
  );

  return (
    <li className='flex flex-col space-y-2'>
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}

export { Todo };
