# Context API 에서 관리하는 상태들을 캡슐화하기

## 문제

```javascript
// src/context/counter.js
const CounterContext = React.createContext()

function CounterProvider({step = 1, initialCount = 0, ...props}) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      const change = action.step ?? step
      switch (action.type) {
        case 'increment': {
          return {...state, count: state.count + change}
        }
        case 'decrement': {
          return {...state, count: state.count - change}
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
    },
    {count: initialCount},
  )

  const value = [state, dispatch]
  return <CounterContext.Provider value={value} {...props} />
}

function useCounter() { // 이렇게 하면 호출하는 쪽에서는 CounterContext 를 사용하는 것에만 집중할 수 있다!
  const context = React.useContext(CounterContext)
  if (context === undefined) {
    throw new Error(`useCounter must be used within a CounterProvider`) 
  }
  return context
}

export {CounterProvider, useCounter}
```

⬆️ 위와 같이 컨텍스트를 사용하는 훅을 별도로 생성하면 재사용성과 유연성을 향상할 수 있다.  

1. useCounter 은 CounterContext 의 구현을 추상화한다. 호출하는 쪽에서는 ConterContext 를 사용하기 위한 중복 코드를 작성하지 않아도 된다.  

2. CounterContext 의 내부 구현이 변경되어도 useCounter 훅을 사용하는 쪽은 영향을 받지 않는다. 모든 변경 사항은 useToggle 내부에서 처리될 수 있기 때문이다.  


3. 서브 컴포넌트들이 컨텍스트 프로바이더로 랩핑되지 않았을때 에러 처리를 동일하게 할 수 있다.  

4. useCounter 훅을 호출하는 쪽에서는 컴포넌트의 실제 로직에만 집중할 수 있고, 컨텍스트 사용의 세부 사항은 useCounter 훅 내부에 숨겨지기 때문에 컴포넌트의 코드가 더 읽기 쉽고 이해하기 쉬워진다.  

```javascript
// src/screens/counter.js
import {useCounter} from 'context/counter'

function Counter() {
  const [state, dispatch] = useCounter()
  const increment = () => dispatch({type: 'increment'}) // 사용하는 쪽에서 type 에 따른 dispatch 호출 함수를 만든다
  const decrement = () => dispatch({type: 'decrement'}) // type 이 늘어날때마다 새로운 함수를 계속 만들어야 할까?
  return (
    <div>
      <div>Current Count: {state.count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

```javascript
// src/index.js
import {CounterProvider} from 'context/counter'
import Counter from 'screens/counter'

function App() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  )
}
```

## 해결 방안 1

```javascript
const increment = React.useCallback(
  () => dispatch({type: 'increment'}),
  [dispatch],
)
const decrement = React.useCallback(
  () => dispatch({type: 'decrement'}),
  [dispatch],
)
const value = {state, increment, decrement}
return <CounterContext.Provider value={value} {...props} />

// now users can consume it like this:

const {state, increment, decrement} = useCounter()
```

컨텍스트 value 에 dispatch 헬퍼 함수를 포함하는 방법이다.  

헬퍼 함수가 의존성 목록에서 실수를 피하고 성능을 향상시키는 데 도움이 될 수 있지만, 때로는 과도할 수도 있다.  

## 해결 방안 2

dispatch를 받아들이는 임포트 가능한 헬퍼를 사용하는 방식이다.  

```javascript
// src/context/counter.js
const CounterContext = React.createContext()

function CounterProvider({step = 1, initialCount = 0, ...props}) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      const change = action.step ?? step
      switch (action.type) {
        case 'increment': {
          return {...state, count: state.count + change}
        }
        case 'decrement': {
          return {...state, count: state.count - change}
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
    },
    {count: initialCount},
  )

  const value = [state, dispatch]

  return <CounterContext.Provider value={value} {...props} />
}

function useCounter() {
  const context = React.useContext(CounterContext)
  if (context === undefined) {
    throw new Error(`useCounter must be used within a CounterProvider`)
  }
  return context
}

const increment = dispatch => dispatch({type: 'increment'})
const decrement = dispatch => dispatch({type: 'decrement'})

export {CounterProvider, useCounter, increment, decrement} // 이렇게 캡슐화한다.
```

```javascript
// src/screens/counter.js
import {useCounter, increment, decrement} from 'context/counter' 

function Counter() {
  const [state, dispatch] = useCounter()
  return (
    <div>
      <div>Current Count: {state.count}</div>
      <button onClick={() => decrement(dispatch)}>-</button>
      <button onClick={() => increment(dispatch)}>+</button>
    </div>
  )
}
```

이렇게 하면 `useCounter` 훅을 호출하는 쪽에서는 `dispatch` 함수를 직접 호출할 수 있기 때문에 리듀서를 dispatch 하기 위한 헬퍼 함수를 만드느라 성가시지 않아도 된다.  
또한, 헬퍼 함수들은 컨텍스트 모듈 밖에 정의되어 있기 때문에, 컨텍스트를 사용하는 컴포넌트와 리듀서 로직 사이의 결합도를 낮출 수 있다.  
즉, 컨텍스트 프로바이더에서 관리하는 상태(함수) 를 캡슐화하여 컨텍스트와 호출하는 쪽의 역할을 보다 명확하게 분리하게 된 것이다.   

