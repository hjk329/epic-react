# useEffect vs useLayoutEffect

`useEffect` 를 주석처리, 혹은 `useLayoutEffect` 를 주석처리하고 각각 테스트해보세요!

```js
import { useEffect, useLayoutEffect, useRef, useState } from "react";

function ResizeExample() {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setHeight(ref.current.clientHeight); // 깜빡거림이 느껴진다.
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "500px"; // 깜박거림이 느껴지지 않는다
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{ background: "lightblue", transition: "height 0.5s" }}
      >
        이 요소의 높이를 조정합니다.
      </div>
      <p>현재 요소의 높이: {height}px</p>
    </div>
  );
}

export default ResizeExample;
```

`useLayoutEffect` 는 paint 과정이 일어나기 전에 동기적으로 실행된다.  

즉, `useLayoutEffect` 내부에서 만든 모든 변경 사항이 브라우저가 화면을 그리기 전에 완료된다.  

따라서, 시각적으로 즉각적인 업데이트가 필요한 작업이나 DOM에서 레이아웃을 읽은 후 그에 기반하여 변경을 수행하는 작업에 사용된다.  

예를 들어, 스크롤의 높이를 측정하여 반영하거나, 레이아웃 속성을 변경하는 등의 작업에 사용될 수 있다.  

하지만, 대부분의 경우 `useEffect` 를 사용하는 것으로 충분하다.  

반면에 `useEffect` 는 DOM 요소가 모두 그려진 이후에 비동기적으로 실행된다.  

즉, `useEffect` 내부에서 트리거된 모든 DOM 조작이나 부수 효과(side effects)는 브라우저가 화면을 그린 후에 발생한다.  

따라서, 깜빡거리는 것처럼 보이는 현상이 발생하기도 한다.  