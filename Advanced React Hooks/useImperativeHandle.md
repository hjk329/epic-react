# 부모 컴포넌트에서 자식 컴포넌트의 메소드를 참조하기

부모 컴포넌트에서 자식 컴포넌트의 인스턴스 메소드를 사용하는 예제를 살펴 봅시다!

```js
class MyInput extends React.Component {
  _inputRef = React.createRef()
  focusInput = () => this._inputRef.current.focus()
  render() {
    return <input ref={this._inputRef} />
  }
}

class App extends React.Component {
  _myInputRef = React.createRef()
  handleClick = () => this._myInputRef.current.focusInput()
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Focus on the input</button>
        <MyInput ref={this._myInputRef} />
      </div>
    )
  }
}
```

<br/>

App 컴포넌트는 자식 컴포넌트인 `MyInput` 에 정의된 메소드 `focusInput` 를 참조할 수 있다.  
App 컴포넌트에 정의된 `_myInputRef` 를 통해 자식 컴포넌트 `MyInput` 컴포넌트에 참조를 만들었기 때문이다.  
즉, `_myInputRef` 은 `MyInput` 컴포넌트의 인스턴스를 가리킨다.  

<br/>

**하지만, 함수형 컴포넌트에서는 위와 같은 방식으로 자식 컴포넌트의 메소드를 호출할 수 없다.**  

함수형 컴포넌트는 단지 렌더링을 위한 함수이고, 컴포넌트가 렌더링될 때마다 새로운 함수 호출이 이루어진다. 따라서, 함수형 컴포넌트에서는 컴포넌트 내부에서 정의한 함수를 컴포넌트 외부에서 직접 호출할 수 없다.   
클래스 컴포넌트처럼 부모 컴포넌트에서 자식 컴포넌트의 인스턴스를 참조할 수 없는 것이다.  

# forwardRef

리액트는 이러한 제약을 극복하기 위해 `forwardRef` 를 제공한다.  

함수형 컴포넌트에서 `forwardRef` 를 사용하면 부모 컴포넌트가 자식 컴포넌트의 DOM 노드나, 자식 컴포넌트 내의 함수에 접근할 수 있다.  
기본적으로, 함수형 컴포넌트에 `ref` 를 직접 전달하는 것은 허용되지 않는다.  

자식 컴포넌트에 `ref` prop 을 전달하면 아래와 같은 오류가 발생한다.  

```
// 자식 컴포넌트에서
`ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop.

// 부모 컴포넌트에서
Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```


하지만, `forwardRef` 를 사용하면 함수형 컴포넌트에서도 `ref` 를 직접 전달할 수 있다.  

`forwardRef` 는 두 개의 인자를 받는데 첫 번째 파라미터 `props` 는 컴포넌트의 props 를 의미하고, 두 번째 파라미터인 `ref` 에 부모 컴포넌트에서 `ref` 를 전달하여 그 자식 컴포넌트에 할당할 수 있게 된다.  

> 디자인 시스템을 개발하며 `forwardRef` 함수를 유용하게 사용하고 있다.  
컴포넌트를 호출하는 쪽에서 `ref` 를 넘겨주어 유연하게 사용하도록 지원하고 싶었기 때문이다!  

# useImperativeHandle

`useImperativeHandle` 훅을 사용하면, 함수형 컴포넌트에서도 부모 컴포넌트가 자식 컴포넌트의 `특정` 함수를 직접 호출할 수 있게 해주어, 명령적인 코드 사용이 가능하다.  
예를 들어, 특정 이벤트 발생 시 입력 필드에 포커스를 주거나, 스크롤 위치를 조정해야 하는 경우 `useImperativeHandle` 훅을 사용하여 부모 컴포넌트가 자식 컴포넌트의 DOM 요소를 직접 조작할 수 있는 함수를 호출할 수 있다.  

`useImperativeHandle` 훅을 사용하면 함수형 컴포넌트 내부에서 정의된 함수나 변수를 외부에서 ref를 통해 접근 가능한 형태로 노출할 수 있다.  
즉, 부모 컴포넌트가 자식 컴포넌트의 특정 함수를 직접 호출할 수 있도록 한다.  

```js

// 자식 컴포넌트
const MyInput = React.forwardRef((props, ref) => {
  const inputRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current.focus(),
  }));
  return <input ref={inputRef} />;
});

function App() {
  const inputRef = useRef();

  const focusOnInput = () => {
    // 자식 컴포넌트의 focusInput 메서드를 호출
    inputRef.current.focusInput();
  };

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={focusOnInput}>입력 창에 포커스</button>
    </div>
  );
}
```

즉, `useImperativeHandle` 훅을 통해 `ref` 로 노출되는 핸들을 사용자가 직접 정의할 수 있게 되었다.  

하지만, 리액트에서 지향하는 선언적 프로그래밍과는 거리가 멀어서 분별해서 사용하는 것이 좋겠다.  

