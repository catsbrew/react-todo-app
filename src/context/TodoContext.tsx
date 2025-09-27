import type { TodoType } from '@/types/todo.type';
import { nanoid } from 'nanoid';
import { createContext, useContext, useReducer } from 'react';
import { toast } from 'sonner';

// --- (1) 타입 정의 ---
interface TodoState {
  todos: TodoType[];
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'TOGGLE_COMPLETED'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; title: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } };

interface TodoContextType {
  todos: TodoType[];
  addTodo: (title: string) => void;
  toggleCompleted: (id: string) => void;
  editTodo: (id: string, title: string) => void;
  deleteTodo: (id: string) => void;
}

const initialState: TodoState = {
  todos: [],
};

// const initialContext: TodoContextType = {
//   todos: [],
//   addTodo: () => {},
//   toggleCompleted: () => {},
//   editTodo: () => {},
//   deleteTodo: () => {},
// };

// --- (2) Context 초기화 및 타입 안전성 확보
const TodoContext = createContext<TodoContextType | null>(null);

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  // 리듀서는 Pure Function(순수 함수)으로 유지: Side Effect(toast)는 넣지 않는다.
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: TodoType = {
        id: nanoid(),
        title: action.payload.title,
        completed: false,
      };
      return { ...state, todos: [newTodo, ...state.todos] };
    }
    case 'TOGGLE_COMPLETED': {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
      return { ...state, todos: updatedTodos };
    }
    case 'EDIT_TODO': {
      const editedTodos = state.todos.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo,
      );
      return { ...state, todos: editedTodos };
    }
    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    }
    default:
      return state;
  }
};

export function TodoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // 일정 추가
  const addTodo = (title: string) => {
    // display 직후 토스트 메시지를 띄우는 것이 가장 즉각적인 UX를 제공한다.
    // ADD는 이전 상태에 의존하지 않고 새 항목의 타이틀만 알면 된다.
    dispatch({ type: 'ADD_TODO', payload: { title } });
    toast.success(`${title} 일정을 추가했어요!`);
  };

  // 일정 체크 박스 이벤트
  const toggleCompleted = (id: string) => {
    // 1. dispatch 전에 '현재' 상태를 기반으로 '미래' 상태를 예측한다.
    const todo = state.todos.find((t) => t.id === id);

    if (todo) {
      // 2. 미래 상태를 const로 깔끔하게 정의
      const isNowCompleted = !todo.completed;

      // 3. 상태 변경 디스패치
      dispatch({ type: 'TOGGLE_COMPLETED', payload: { id } });

      // 4. 예측된 미래 상태를 기반으로 토스트 즉시 출력 (사용자가 원하는 정확한 피드백)
      if (isNowCompleted) {
        toast.success('🥳 일정을 완료했어요! 🎉');
      } else {
        toast.info('🙏 체크를 해제했어요. 다시 힘내봐요!');
      }
    }
  };

  // 일정 수정
  const editTodo = (id: string, newTitle: string) => {
    const todo = state.todos.find((todo) => todo.id === id);

    // 1. 변경된 내용이 실제로 있는지 확인하여 불필요한 dispatch 및 toast를 방지합니다.
    if (todo && todo.title !== newTitle) {
      const oldTitle = todo.title;

      // 2. 상태 변경 디스패치
      dispatch({ type: 'EDIT_TODO', payload: { id, title: newTitle } });

      // 3. 토스트 즉시 출력
      toast.success(`'${oldTitle}' 일정을 '${newTitle}'로 수정했어요!`);
    } else {
      // 변경 사항이 없는 경우 토스트
      toast.info('변경 사항이 없어서 수정하지 못해요.');
    }
  };

  // 일정 삭제
  const deleteTodo = (id: string) => {
    const todo = state.todos.find((todo) => todo.id === id);

    if (todo) {
      const deleteTitle = todo.title;

      // 1. 상태 변경 디스패치
      dispatch({ type: 'DELETE_TODO', payload: { id } });

      // 2. 토스트 즉시 출력
      toast.success(`'${deleteTitle || '알 수 없는'}' 일정이 삭제되었습니다.`);
    }
  };

  const value: TodoContextType = {
    todos: state.todos,
    addTodo,
    toggleCompleted,
    editTodo,
    deleteTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodo = () => {
  const context = useContext(TodoContext);

  if (context === null) {
    throw new Error(
      'useTodo는 반드시 TodoContextProvider 내부에서 사용되어야 합니다.',
    );
  }
  return context;
};
