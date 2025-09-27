import { Fragment, useEffect, useRef, useState } from 'react';

import { nanoid } from 'nanoid';
import { FilterButton, Form, Todo } from './components/common';
import { ModeToggle } from './components/mode-toggle';
import { Badge, Separator } from './components/ui';
import { toast } from 'sonner';
import { usePrevious } from './hooks/usePrevious';
import type { TypeTodo } from './types/todo.type';

export type FilterType = keyof typeof FILTER_MAP;

const FILTER_MAP = {
  All: () => true,
  Active: (todo: TypeTodo) => !todo.completed,
  Completed: (todo: TypeTodo) => todo.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP) as FilterType[];

function App() {
  const [todos, setTodos] = useState<TypeTodo[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  const listHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const prevTodoLength = usePrevious<number>(todos.length);

  useEffect(() => {
    if (todos.length - Number(prevTodoLength) === 1) {
      listHeadingRef.current?.focus();
    }
  }, [todos.length, prevTodoLength]);

  // 일정 추가
  const handleAddTodo = (title: string) => {
    const newTodo = { id: nanoid(), title, completed: false };
    setTodos([...todos, newTodo]);
    toast.success(`${title} 일정을 추가했어요!`);
  };

  // 일정 체크 박스 이벤트
  const handleToggleCompleted = (id: string) => {
    let isNowCompleted = false; // 함수 바깥에 변수 선언 (미래 상태 예측)

    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          isNowCompleted = !todo.completed; // 비동기 함수 내부에서 isNowCompleted 값을 업데이트

          return {
            ...todo,
            completed: isNowCompleted,
          };
        }
        return todo;
      });
      return updatedTodos;
    });

    // 비동기 함수가 종료된 후, 업데이트된 isNowCompleted 값을 읽어 토스트 메시지 출력
    if (isNowCompleted) {
      toast.success('🥳 일정을 완료했어요! 🎉');
    } else {
      toast.info('🙏 체크를 해제했어요. 다시 힘내봐요!');
    }
  };

  // 일정 삭제
  const handleDeleteTodo = (id: string) => {
    const deleteTitle = todos.find((todo) => todo.id === id)?.title; // 비동기 함수 호출 전에 즉시 값을 읽음 (현재 상태 즉시 확보)

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)); // 비동기 상태 업데이트 예약

    // 삭제 전에 읽은 deleteTitle 변수를 그대로 사용
    toast.success(`${deleteTitle || '알 수 없는'} 일정이 삭제되었습니다.`);
  };

  // 일정 수정
  const handleEditTodo = (id: string, newTitle: string) => {
    let nowTodoTitle = '';
    let hasChanged = false;

    setTodos((prevTodos) => {
      const editedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          if (todo.title !== newTitle) {
            hasChanged = true;
            nowTodoTitle = newTitle;

            return { ...todo, title: nowTodoTitle };
          }
          return todo;
        }
        return todo;
      });
      return editedTodos;
    });

    if (hasChanged) {
      toast.success(`${nowTodoTitle} 일정을 수정했어요!`);
    }
  };

  // 투두 리스트 조건부 렌더링
  let todoList: React.ReactNode = (
    <div className='text-center text-muted-foreground p-8'>
      일정이 없습니다.
    </div>
  );

  if (todos && todos.length > 0) {
    todoList = todos.filter(FILTER_MAP[filter]).map((todo: TypeTodo, idx) => (
      <Fragment key={todo.id}>
        <Todo
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onToggleCompleted={handleToggleCompleted}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
        />
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
        <Form onAddTodo={handleAddTodo} />

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
