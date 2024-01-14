# Hooks Flow
![image](https://github.com/hjk329/epic-react/assets/84058944/76525325-3ef5-4d9c-8994-75e0fa78843f)

# 🕵🏻‍♀️ 이해해보세요!

```js
// Hook flow
// https://github.com/donavon/hook-flow
// http://localhost:3000/isolated/examples/hook-flow.js

// PLEASE NOTE: there was a subtle change in the order of cleanup functions
// getting called in React 17:
// https://github.com/kentcdodds/react-hooks/issues/90

import * as React from 'react'

function Child() {
  console.log('%c    Child: render start', 'color: MediumSpringGreen')

  const [count, setCount] = React.useState(() => {
    console.log('%c    Child: useState(() => 0)', 'color: tomato')
    return 0
  })

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {})', 'color: LightCoral')
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}) cleanup 🧹',
        'color: LightCoral',
      )
    }
  })

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => {}, [])',
      'color: MediumTurquoise',
    )
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {}, [count])', 'color: HotPink')
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, [count]) cleanup 🧹',
        'color: HotPink',
      )
    }
  }, [count])

  const element = (
    <button onClick={() => setCount(previousCount => previousCount + 1)}>
      {count}
    </button>
  )

  console.log('%c    Child: render end', 'color: MediumSpringGreen')

  return element
}

function App() {
  console.log('%cApp: render start', 'color: MediumSpringGreen')

  const [showChild, setShowChild] = React.useState(() => {
    console.log('%cApp: useState(() => false)', 'color: tomato')
    return false
  })

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {})', 'color: LightCoral')
    return () => {
      console.log('%cApp: useEffect(() => {}) cleanup 🧹', 'color: LightCoral')
    }
  })

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [])', 'color: MediumTurquoise')
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [showChild])', 'color: HotPink')
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, [showChild]) cleanup 🧹',
        'color: HotPink',
      )
    }
  }, [showChild])

  const element = (
    <>
      <label>
        <input
          type="checkbox"
          checked={showChild}
          onChange={e => setShowChild(e.target.checked)}
        />{' '}
        show child
      </label>
      <div
        style={{
          padding: 10,
          margin: 10,
          height: 50,
          width: 50,
          border: 'solid',
        }}
      >
        {showChild ? <Child /> : null}
      </div>
    </>
  )

  console.log('%cApp: render end', 'color: MediumSpringGreen')

  return element
}

export default App

```


## 클린업 함수

### 클린업 함수는 컴포넌트가 DOM에서 제거될때, 즉 언마운트될때 실행된다. 
이는 컴포넌트의 생명주기가 끝날 때 정리 작업을 수행하기 위해 사용된다.  

**언마운트**는 아래와 같은 경우에 발생한다.  

1. 라우팅 변경: 다른 페이지로 이동할때 이전 페이지의 컴포넌트들이 언마운트된다.
2. 조건부 렌더링: 컴포넌트가 조건부 렌더링을 통해 더 이상 렌더링되지 않을때 언마운트된다.
3. 부모 컴포넌트가 언마운트될 때: 부모 컴포넌트가 언마운트되면, 그 자식 컴포넌트들도 함께 언마운트 된다. React 17부터는 부모 컴포넌트가 언마운트될 때 자식 컴포넌트의 클린업 함수가 먼저 호출되고, 이후 부모 컴포넌트의 클린업 함수가 호출된다.


---

### 클린업 함수는 의존성 배열에 있는 값이 변경될 때마다 실행된다. 
`useEffect` 에 의존성 배열을 제공한 경우, 배열 안의 값이 변경될 때마다 클린업 함수가 실행되고, 그 후 새로운 이펙트 함수가 실행된다.  
이는 이전 이펙트에 의한 부작용을 정리하고 새로운 이펙트를 준비하는 데 사용된다.  


```js
  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [showChild])', 'color: HotPink')
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, [showChild]) cleanup 🧹',
        'color: HotPink',
      )
    }
  }, [showChild])
```

개발 모드에서와 프로덕션 모드에서의 플로우가 다름.
