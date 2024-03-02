# Compound Pattern

Compound Pattern(이하 컴파운드 패턴)은 재사용 가능한 컴포넌트들을 위한 간결하면서도 강력하고, 선언적인 API 를 제공한다.  
컴파운드 컴포넌트는 암시적으로 상태를 공유한다.  
컴파운드 컴포넌트는 함께 작동하여 완전한 UI 를 형성하는 컴포넌트들이다.  
이 패턴의 고전적인 예는 HTML 의  `<select>` 와 `<option>` 이다.  

```html
<select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

여기서 `<select>` 는 UI 의 상태를 관리하는 역할을 하고, `<option>` 요소들은 select 가 어떻게 동작해야 하는지에 대한 설정을 제공한다. 

아래와 같은 컴포넌트는 어떨까?

```jsx
<CustomSelect
  options={[
    {value: '1', display: 'Option 1'},
    {value: '2', display: 'Option 2'},
  ]}
/>
```

컴파운드 컴포넌트보다 확장성이나 유연성이 매우 떨어진다.  
예를 들어, 렌더링되는 option 에 추가적인 속성을 제공하고 싶거나, option 의 선택 여부에 따라 display 가 변경되길 원한다면 어떻게 수정해야 할까?  
변경 사항이 생길때마다 `<CustomSelect>` 컴포넌트의 인터페이스에도 큰 변경이 필요할 것이다.  

이때 컴파운드 패턴은 확장성과 유연성을 제공한다!  

## 예제 1

```jsx
import React, { useState, cloneElement, Children } from 'react';

const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {Children.map(children, (child, index) =>
        cloneElement(child, { // 부모 컴포넌트와 자식 컴포넌트간에 상태를 공유한다.
          isActive: index === activeIndex,
          onActivate: () => setActiveIndex(index)
        })
      )}
    </div>
  );
};

const Tab = ({ isActive, onActivate, children }) => (
  <button onClick={onActivate} style={{ color: isActive ? 'red' : 'black' }}>
    {children}
  </button>
);

// 사용 예
const App = () => (
  <Tabs>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <Tab>Tab 3</Tab>
  </Tabs>
);

export default App;
```

위 예제에서는 `cloneElement` 를 사용해서 상위 컴포넌트와 하위 컴포넌트가 상태를 공유했다.  
**Tabs 컴포넌트와 Tab 컴포넌트는 독립적으로 동작**하면서도 합성해서 자유롭게 배치할 수 있게 되었다.  
이는 컴포넌트의 재사용성을 강화한다.  

하지만, Tab 컴포넌트의 props 가 변경된다면 Tabs 컴포넌트에도 변경 사항이 발생할 수 있다.  

이때 Context API 를 사용하면 보다 유연하게 상태를 공유할 수 있다.  

## 예제 2

```jsx
import React, { useState, createContext, useContext } from 'react';

// Context 생성
const TabsContext = createContext();

// Context Provider 컴포넌트
function TabsProvider({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const value = { activeIndex, setActiveIndex };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
```

```jsx
const Tabs = ({ children }) => {
  return <TabsProvider>{children}</TabsProvider>;
};
```

```jsx
const Tab = ({ index, children }) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = index === activeIndex;

  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{ color: isActive ? 'red' : 'black' }}
    >
      {children}
    </button>
  );
};
```

```jsx
const App = () => (
  <Tabs>
    <Tab index={0}>Tab 1</Tab>
    <Tab index={1}>Tab 2</Tab>
    <Tab index={2}>Tab 3</Tab>
  </Tabs>
);

export default App;
```


이 방식을 사용하면, cloneElement를 사용하지 않고도 컴포넌트 간에 상태를 효율적으로 공유할 수 있으며, Tab 컴포넌트의 props가 변경되어도 Tabs 컴포넌트를 수정할 필요가 없다.  


즉, 컴포넌트간의 결합도를 낮추고, 재사용성과 유지보수성을 향상하는 구조이다.  