# Props Collection

컴포넌트가 복잡해질 수록 요소에 적용해야 할 속성들의 목록이 광범위해질 수 있다.  

이때 요소에 필요한 모든 속성들을 기억하고 사용하는 것은 어려울 수 있다.  

예를 들어, 아래와 같은 코드가 있다고 하자.  

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


# Props Getter

Props Getter 는 말 그대로 개발자가 필요한 props 를 쉽게 얻도록 지원하는 패턴이다.  

props getter 를 통해 같은 로직이나 스타일을 가진 컴포넌트의 props를 쉽게 재구성할 수 있다.  

```jsx
import * as React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args)) // truthy한 모든 함수를 호출하기 위한 유틸

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  return {
    on,
    toggle,
    getTogglerProps,
  }
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} /> // props getter 패턴 사용
      <hr />
      <button
        {...getTogglerProps({ 
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })} // props getter 패턴 사용
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App
```

이렇게 props getter 함수가 있으면 필요한 props를 쉽게 얻을 수 있고, 컴포넌트의 사용법이 단순화되어 개발자의 작업 부담이 줄어들 수도 있다.  

> 개인적으로는, props가 캡슐화 되다보니 props collection 혹은 props getter 내부를 들여다 봐야 해서 소스 코드를 파악하는 데에 오히려 리소스가 더 드는 일일 수 있겠다고 생각한다. 따라서, props collection, props getter 를 구현하는 것이 자칫 오버엔지니어링이 될 수 있겠다는 생각이 들었다. 하지만, 다양한 UI 컴포넌트를 재사용하고 확장해야 하는 상황이라던지, (특히 웹 접근성을 향상하려 할때) 강력한 패턴이 될 수 있다는 데에 동의한다.