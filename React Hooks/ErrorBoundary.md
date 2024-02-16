```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

# static 메소드
static 메소드는 클래스 레벨 자체와 관련된 작업을 수행하는 데에 주로 사용된다.  
인스턴스를 생성하지 않고도 호출할 수 있다.  

그에 반해 인스턴스 메소드는 클래스의 인스턴스에 접근하기 위해 사용된다.  

```js
class ExampleClass {
  static staticMethod() {
    console.log('I am a static method');
  }

  instanceMethod() {
    console.log('I am an instance method');
  }
}

// static 메소드 호출
ExampleClass.staticMethod(); // 출력: I am a static method

// 인스턴스 메소드 호출을 시도하기 전에 인스턴스 생성
const exampleInstance = new ExampleClass();
exampleInstance.instanceMethod(); // 출력: I am an instance method

// 인스턴스를 생성하지 않고 인스턴스 메소드를 호출
ExampleClass.instanceMethod(); // Uncaught TypeError: ExampleClass.instanceMethod is not a function
```

# 에러바운더리는 왜 클래스 컴포넌트만 지원할까?
리액트는 상태, 라이프 사이클 메소드를 클래스 컴포넌트에서 다루도록 설계했었다. 클래스 컴포넌트는 **`React.Component`** 를 상속 받는다.  

`React.Component` 는 리액트의 핵심 API 를 담고 있는 클래스로, 리액트의 라이프 사이클 메소드가 포함된다.   
따라서, `React.Component` 를 상속 받은 클래스는 (에러바운더리처럼) 리액트의 라이프 사이클 메소드를 컴포넌트 내부에서 상속 받아서 사용할 수 있다.  

그에 반해 함수형 컴포넌트는 `React.Component` 를 직접 상속 받지 않는다.  
함수형 컴포넌트는 단순히 `props` 를 넘겨 받아서 UI 를 그려주는 용도로 설계되었기 때문이다.  
하지만, 리액트 16.8 이후에 `hooks` 의 등장으로 함수형 컴포넌트에서도 상태나 라이프 사이클 메소드를 구현할 수 있게 되었다. `useState`, `useEffect`, `useContext` 등등 ..  

---
함수형 컴포넌트에서 React.Component를 상속받지 않고도 리액트의 핵심 기능을 활용할 수 있지만, 에러 바운더리와 관련된 라이프 사이클 메소드인 getDerivedStateFromError와 componentDidCatch는 예외입니다.  
이 메소드들은 현재 함수형 컴포넌트에서는 사용할 수 없으며, 클래스 컴포넌트에서만 사용할 수 있습니다. 이유는 다음과 같습니다:  

📍 에러 바운더리와 라이프 사이클 메소드
에러 바운더리는 자식 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하고 처리하는 메커니즘입니다.  
getDerivedStateFromError와 componentDidCatch 라이프 사이클 메소드는 에러 바운더리 컴포넌트가 에러를 포착하고, 이에 대응하여 UI를 업데이트하거나 로깅하는 데 사용됩니다.

getDerivedStateFromError(error): 이 메소드는 에러가 발생했을 때 컴포넌트의 state를 업데이트하기 위해 사용됩니다.
이를 통해 에러 발생 후의 fallback UI를 렌더링할 수 있습니다.  
componentDidCatch(error, info): 이 메소드는 에러가 발생한 후에 실행되며, 에러 정보를 로깅하는 데 사용할 수 있습니다.  

📍함수형 컴포넌트의 제한
함수형 컴포넌트에서 Hooks를 사용하여 많은 라이프 사이클 메소드의 기능을 모방할 수 있습니다.
예를 들어, useEffect는 componentDidMount, componentDidUpdate, componentWillUnmount의 기능을 대체할 수 있습니다.
그러나 getDerivedStateFromError와 componentDidCatch는 Hooks를 통해 대체할 수 없습니다.
이는 에러 처리 로직이 컴포넌트의 렌더링 결과에 직접적으로 영향을 미치기 때문에, 리액트 팀이 아직 함수형 컴포넌트에서 이를 안전하고 일관되게 구현할 방법을 제공하지 않았기 때문입니다.

---

