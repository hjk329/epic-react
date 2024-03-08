# Code Split

코드 스플리팅(Code Splitting)은 웹 애플리케이션의 성능 최적화를 위해 사용되는 중요한 기술이다.  

사용자가 애플리케이션의 초기 로딩 시 필요하지 않은 코드를 제외함으로써, 초기 로딩 시간을 줄일 수 있다.  

또한, 사용자가 실제로 필요로 하는 기능의 코드만 로드하도록 하여, 네트워크 사용량과 자원 사용을 최적화한다.  

코드 스플리팅은 웹팩(Webpack), 롤업(Rollup), 파셀(Parcel)과 같은 현대적인 모듈 번들러를 사용하여 구현할 수 있으며, React 에서는 `React.lazy` API 를 제공한다.  

## 예제 1

```jsx
import * as React from 'react'
import Globe from '../globe' // 크기가 엄청 큰 자원이라고 가정한다.

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        {showGlobe ? <Globe /> : null}
      </div>
    </div>
  )
}

export default App
```

### 개선 1 React.lazy

```jsx
import * as React from 'react'

const Globe = React.lazy(() => import('../globe'));

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
      <React.Suspense fallback='... loading globe'>
        {showGlobe ? <Globe /> : null}
      </React.Suspense>
      </div>
    </div>
  )
}

export default App
```

**React.lazy를 사용하여 정의된 컴포넌트는 필요할 때 비동기적으로 렌더링한다.**  

즉, 해당 컴포넌트가 렌더링되어야 하는 시점에 React가 자동으로 컴포넌트의 코드 청크를 로드하기 시작한다.  

이때 Suspense 컴포넌트를 함께 사용한다.  

Suspense 컴포넌트는 자식 컴포넌트 중 하나가 로딩 중인 경우 대체 콘텐츠(로딩 인디케이터 등)를 렌더링할 수 있도록 지원한다.   
컴포넌트의 코드가 완전히 로드되어 렌더링이 준비될 때까지 Suspense가 대체 콘텐츠를 보여주고, 준비가 완료되면 실제 컴포넌트를 렌더링하는 식이다.  

React.lazy API 를 사용해서 자원이 필요한 상황(사용자가 체크박스를 선택했을때)이 되었을때 해당 자원을 로드한다. 

사용자가 체크박스를 선택했을때 더 빠르게 Globe를 제공하는 방법이 있을까?

### 개선 2 Eager Loading

Eager Loading은 애플리케이션이 시작할 때 또는 특정 컴포넌트가 렌더링되기 전에 관련된 자원이나 모듈을 미리 로드하는 전략이다.  

이 방식은 필요한 모든 데이터나 코드를 사전에 로드함으로써, 사용자가 실제로 해당 기능을 사용할 때 발생할 수 있는 지연 시간을 줄일 수 있다.  

```jsx
import * as React from 'react'

const loadGlobe = () => import('../globe');

const Globe = React.lazy(loadGlobe);

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}} onMouseEnter={loadGlobe} onFocus={loadGlobe}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
      <React.Suspense fallback='...loading globe'>
        {showGlobe ? <Globe /> : null}
      </React.Suspense>
      </div>
    </div>
  )
}

export default App
```

체크박스의 라벨에 마우스를 호버하거나, 포커스가 되었을때 Globe 를 로드한다.    
이렇게 하면 사용자가 체크박스를 선택했을때 로딩 시간이 길지 않고, 거의 즉각적으로 Globe를 보여주게 된다!  


### 개선 3 webpackPrefetch


webpackPrefetch는 웹팩(Webpack)에서 제공하는 특별한 주석 힌트다.  
이 힌트를 사용하면 브라우저가 현재 페이지에서 나중에 필요할 수 있는 리소스를 미리 가져오도록 지시할 수 있다.  

webpackPrefetch는 사용자가 해당 리소스에 실제로 접근하기 전, 네트워크가 유휴 상태일 때 백그라운드에서 리소스를 로드한다.  

브라우저는 이 정보를 바탕으로, 메인 콘텐츠의 로딩에 영향을 주지 않으면서 유휴 시간에 해당 리소스를 미리 다운로드한다.  

```jsx
import * as React from 'react'

const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<div>loading globe...</div>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
```

크롬 개발자 도구의 요소(Elements) 를 살펴보면 Globe 리소스를 미리 가져오기 위해서 `head` 태그 안에 `<link rel="prefetch" ...>` 태그가 생성된걸 확인할 수 있다.  

<head> 태그에 추가된 `<link rel="prefetch">` 태그는 리소스의 우선 순위를 낮춰, 현재 페이지의 로딩 성능에 영향을 주지 않으면서 리소스를 미리 다운로드할 수 있다.  

이는 브라우저가 중요한 콘텐츠와 리소스의 로딩을 우선적으로 처리하고, 백그라운드에서 비동기적으로 나머지 리소스를 가져오는 방식으로 작동한다.  

**번외 Suspense의 위치**

1. Suspense 가 조건부 렌더링 외부를 감싸고 있다

```jsx
const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))

function App(){
    return (
        <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<div>loading globe...</div>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    )
}
```

2. Suspense 가 조건부 렌더링 로직 내부에 있다

```jsx
const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))

function App(){
    return (
        <div style={{width: 400, height: 400}}>
       
          {showGlobe ?  
          <React.Suspense fallback={<div>loading globe...</div>}>
          <Globe />        
          </React.Suspense> 
          : null}
      </div>
    )
}
```

Concurrent React (React 18 이상)를 사용할 때도 Suspense 컴포넌트는 초기 마운트 시에 설정된 지연 시간을 기다리지 않고 즉시 fallback 내용을 보여준다.  
이는 사용자에게 빠른 피드백을 제공하여 애플리케이션의 반응성을 개선하기 위함이다.  

그러나, Suspense 컴포넌트가 `showGlobe` 같은 조건부 렌더링 내에 있다면 해당 컴포넌트가 활성화되어 나타날 때마다 Suspense 컴포넌트도 새롭게 마운트되고, 이는 초기 로딩 동작을 반복하게 만든다.  

따라서, Suspense 컴포넌트를 조건부 로직의 바깥쪽에 배치함으로써, 컴포넌트가 처음 마운트될 때 한 번만 fallback 동작을 하도록 설정하는 1번 방식을 지향한다.  