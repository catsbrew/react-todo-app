import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Input } from '../ui';

interface Props {
  onAddTodo: (title: string) => void;
}

function Form({ onAddTodo }: Props) {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '') {
      return;
    }
    onAddTodo(title);
    setTitle('');
  };

  return (
    <form className='w-full flex space-x-2' onSubmit={handleSubmit}>
      <Input
        type='text'
        placeholder='Ex) 리액트 공부하기'
        id='new-todo-input'
        name='text'
        autoComplete='off'
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        className='py-5 rounded-lg'
      />
      <Button type='submit' variant={'outline'} className='cursor-pointer py-5'>
        추가
      </Button>
    </form>
  );
}

export { Form };
