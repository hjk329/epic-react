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
