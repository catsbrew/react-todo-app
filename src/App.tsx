import { Fragment, useEffect, useRef, useState } from 'react';

import { FilterButton, Form, Todo } from './components/common';
import { ModeToggle } from './components/mode-toggle';
import { Badge, Separator } from './components/ui';
import { usePrevious } from './hooks/usePrevious';
import type { TodoType } from './types/todo.type';
import { useTodo } from './context/TodoContext';

export type FilterType = keyof typeof FILTER_MAP;

const FILTER_MAP = {
  All: () => true,
  Active: (todo: TodoType) => !todo.completed,
  Completed: (todo: TodoType) => todo.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP) as FilterType[];

function App() {
  const { todos } = useTodo();

  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  const listHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const prevTodoLength = usePrevious<number>(todos.length);

  useEffect(() => {
    if (todos.length - Number(prevTodoLength) === 1) {
      listHeadingRef.current?.focus();
    }
  }, [todos.length, prevTodoLength]);

  // 투두 리스트 조건부 렌더링
  let todoList: React.ReactNode = (
    <div className='text-center text-muted-foreground p-8'>
      일정이 없습니다.
    </div>
  );

  if (todos && todos.length > 0) {
    todoList = todos.filter(FILTER_MAP[filter]).map((todo: TodoType, idx) => (
      <Fragment key={todo.id}>
        <Todo id={todo.id} title={todo.title} completed={todo.completed} />
        {idx !== todos.length - 1 && (
          <div className='flex justify-center w-full'>
            <Separator orientation='horizontal' className='!w-4' />
          </div>
        )}
      </Fragment>
    ));
  }

  // 필터 버튼
  const filterList: React.ReactNode = FILTER_NAMES.map((name, idx) => (
    <Fragment key={name}>
      <FilterButton
        text={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
      {idx !== FILTER_NAMES.length - 1 && (
        <Separator orientation='vertical' className='!h-4' />
      )}
    </Fragment>
  ));

  return (
    <div className='max-w-[350px] min-h-[100vh] flex items-center mx-auto'>
      <div className='w-full h-full space-y-4 my-40'>
        <div className='w-full flex items-center justify-between'>
          <Badge className='text-lg'>Todo-ddodo</Badge>
          <ModeToggle />
        </div>

        {/* 입력 폼 */}
        <Form
        // onAddTodo={handleAddTodo}
        />

        {/* 필터 버튼들 */}
        <div className='flex items-center justify-between space-x-2 text-sm'>
          {filterList}
        </div>

        {/* 태스크 갯수 */}
        <Badge variant={'secondary'} className='bg-blue-500/50'>
          <h2 ref={listHeadingRef}>
            {todos.filter(FILTER_MAP[filter]).length}개의 일정
          </h2>
        </Badge>

        {/* 태스크 리스트 렌더링 */}
        <ul
          className='flex flex-col space-y-6'
          role='list'
          aria-labelledby='list-heading'
        >
          {/* 데이터가 있을 때와 데이터가 없을 때의 UI를 다르게 렌더링 */}
          {todoList}
        </ul>
      </div>
    </div>
  );
}

export default App;
