# `useState` 로 작성된 코드를 `useReducer` 를 사용하도록 변경해 보자.  

```jsx
import * as React from 'react'

function Counter({initialCount = 0, step = 1}) {
  const [count, setCount] = React.useState(initialCount)
  const increment = () => setCount(count + 1)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App

```

## useReducer

### Parameters

`useReducer` 는 첫번째 인자로 `reducer`, 두번째 인자로 `initializerArg` 를 받는다.  

reducer 함수는 인자로 state 와 action 을 받는데 어떤 유형이든 가능하고, 다음 state를 반환해야 한다.  

### Returns

`useReducer` 는 두 개의 값을 가진 배열을 반환한다.  

- 현재 state
- state 를 업데이트할 dispatch 함수

이때 dispatch 함수에는 유일한 인수로 액션을 전달해야 한다.  
관용적으로 액션은 보통 이를 식별하는 type 속성이 있는 객체이다.   

그리고, dispatch 함수는 리듀서를 트리거한다.  

dispatch 함수는 전달받은 액션 객체를 리듀서 함수에 인자로 넘긴다.  
리듀서 함수는 현재 상태(state)와, dispatch 함수에서 넘겨 받은 액션 객체(action)를 기반으로 새로운 상태를 계산한다.  
따라서, 리듀서는 `순수 함수`여야 한다.  

정리하자면 React는 reducer 함수에 현재 state와 dispatch한 액션을 전달하고, 그 결과를 다음 state로 설정한다.  

```jsx
import * as React from 'react'

function countReducer (state, newState){
  return newState
}

function Counter({initialCount = 0, step = 1}) {
  const [count, setCount] = React.useReducer(countReducer, initialCount)
  const increment = () => setCount(count + 1)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
```

위 코드에서는 `setCount` 가 상태를 업데이트하고 리렌더링을 유발하는 dispatch 역할을 한다.  

그리고, 새로운 상태 값이 dispatch 에 직접 전달되고 있다. 

이때 리듀서가 dispatch 에서 넘겨받은 값을 바로 반환하므로 `useState` 를 사용하던 기존 예제와 동일하게 동작한다.  

혹은 아래와 같은 방법도 있겠다.  

```jsx

import * as React from 'react'

function countReducer (count, step){
  return count + step
}

function Counter({initialCount = 0, step = 1}) {
  const [count, changeCount] = React.useReducer(countReducer, initialCount)
  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}
```

dispatch 함수에 step 을 인자로 넘겨서 reducer 를 호출한다.  
reducer 는 현재 state 와 dispatch 에서 넘겨준 액션 (step) 을 알고 있고, 우리가 원하는 것은 현재 state 가 step 만큼 더해지는 것이다.  