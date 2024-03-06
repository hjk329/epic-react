# Props Collection

아래와 같은 코드가 있다고 하자.  
컴포넌트가 복잡해질 수록 요소에 적용해야 할 속성들의 목록이 광범위해질 수 있다.  

```jsx
import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return {on, toggle}
}

function App() {
  const {on, toggle} = useToggle()
  return (
    <div>
      <Switch on={on} onClick={toggle} />
      <hr />
      <button aria-label="custom-button" onClick={toggle}>
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App
```

위 소스 코드에 웹 접근성을 고려하여 `aria-pressed(토글이 켜지거나, 꺼졌음을 나타냄)` 속성을 추가해야 한다고 생각해 보자.  
Switch 컴포넌트와 button 요소에 각각 `aria-pressed` 속성을 적용하기 위해 반복적인 코드를 작성해야 한다.   

일반적으로, 웹 접근성을 위한 ARIA 디자인 패턴을 구현하기 위해 컴포넌트의 속성들로 추가되어야 할 관련 attribute 들이 많다.  
위와 같은 소스 코드에서는 많은 attribute 들을 반복적으로 작성해야 할 수도 있다.  
또한, 스위치를 토글하기 위해 onClick 핸들러를 추가하는 것도 잊지 않아야 한다.  

따라서, props collection 패턴은 특정 UI 컴포넌트에 필요한 모든 props를 미리 구성한 컬렉션을 제공하는 것에 의의가 있다.  


```jsx
import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return {
    on,
    toggle,
    togglerProps: {
      'aria-pressed': on,
      onClick: toggle,
    },
  }
}

function App() {
  const {on, togglerProps} = useToggle()
  return (
    <div>
      <Switch on={on} {...togglerProps} /> // props collection 사용
      <hr />
      <button aria-label="custom-button" {...togglerProps}> // props collection 사용
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App
```

이렇게 하면 동일한 props 구성을 여러 번 반복해서 작성할 필요가 없어진다.  