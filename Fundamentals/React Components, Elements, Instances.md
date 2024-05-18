> [React Components, Elements, and Instances](https://ko.legacy.reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html) 을 읽고 제가 이해한 내용을 정리합니다.

# Managing the Instances

전통적인 UI 모델(OOP)에서는 부모 컴포넌트가 자식 컴포넌트 인스턴스와 해당 DOM 노드를 직접 참조하고, 생성, 업데이트, 제거 등을 관리합니다.  
예를 들어, 부모 클래스가 자식 인스턴스의 DOM 노드나 데이터를 직접 관리하는 방식입니다. 이는 컴포넌트간에 강한 결합을 초래할 수 있습니다.

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    // Read some data passed to the view
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // Form is not yet submitted. Create the button!
      this.button = new Button({
        children: buttonText,
        color: "blue",
      });
      this.el.appendChild(this.button.el); // 부모인 Form 은 자식 Button 의 DOM 노드를 직접적으로 알고 있다. (참조한다)
    }

    if (this.button) {
      // The button is visible. Update its text!
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // Form was submitted. Destroy the button!
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // Form was submitted. Show the success message!
      this.message = new Message({ text: "Success!" });
      this.el.appendChild(this.message.el);
    }
  }
}
```

위 코드에서 Form 클래스에서 Button 인스턴스를 생성하고, DOM 에 어떻게 생성할지, 어떻게 업데이트하거나 제거할지 직접 관여하고 있는 점을 봐주세요!  
이는 컴포넌트의 인스턴스가 DOM 노드에 대한 참조를 유지해야 함을 시사합니다.

정리하자면 리액트 이전의 전통적인 방식에서는 부모 컴포넌트는 자식 컴포넌트 인스턴스와 해당 DOM 노드를 직접 참조하여 생성, 업데이트, 제거를 관리했습니다.  
하지만, 관리할 상태가 많아질수록 이러한 구조는 복잡성을 증가시켰습니다. 특히, 부모 컴포넌트가 자식 컴포넌트의 인스턴스를 직접 참조하기 있기 때문에 컴포넌트를 분리하기가 어려워집니다.

리액트는 컴포넌트의 인스턴스가 자신의 DOM 노드와 자식 컴포넌트 인스턴스를 직접 참조하는 문제를 해결하고자 했습니다.

# Elements Describe the Tree

엘리먼트는 컴포넌트 인스턴스나 DOM 노드와 그 속성들을 설명하는 단순한 객체입니다.  
이 객체는 컴포넌트의 `type`과, `props`, `children` 에 대한 정보만 포함합니다.

**엘리먼트는 실제 인스턴스가 아닙니다.**  
엘리먼트는 그저 화면에 `무엇을` 그리고 싶은지를 리액트에게 설명합니다.  
`어떻게` 그릴지는 리액트 내부적으로 처리되는 것입니다. 리액트가 선언적 프로그래밍을 지향한다는 점을 다시금 상기하게 됩니다!

## DOM Elements

만약 엘리먼트의 `type` 이 문자열이라면 이는 해당 태그 이름을 가진 DOM 노드를 나타내며, 속성은 해당 DOM 노드의 속성에 대응됩니다.

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!' // children 을 통해 엘리먼트를 중첩할 수 있어요!
      }
    }
  }
}
```

위 엘리먼트는 아래 HTML 을 단순한 객체로 표현한 것입니다.

```html
<button class="button button-blue">
  <button> OK! </b>
</button>
```

**중요한 것은 부모와 자식 엘리먼트 모두가 실제 인스턴스가 아니라는 점입니다. 엘리먼트를 생성할 때 화면상의 어떤 것도 참조하지 않습니다.**

리액트 엘리먼트는 실제 DOM 노드에 직접적으로 대응하지 않지만, 리액트는 가상 DOM을 사용하여 엘리먼트와 실제 DOM 간의 관계를 관리하기 때문입니다.

`무엇을(엘리먼트)` 그릴지만 알려주면 이걸 `어떻게` 그릴지는 리액트의 가상 DOM에서 내부적으로 처리하는 것입니다.  
이 과정에서 개발자는 직접 DOM을 조작할 필요 없이, 선언적으로 UI를 정의하기만 하면 됩니다.  
리액트 엘리먼트는 단순 객체이므로 실제 DOM 보다 훨씬 가볍습니다.

## Component Elements

엘리먼트의 `type` 이 리액트 컴포넌트에 해당하는 함수나 클래스일 수도 있습니다.

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

앞서 살펴본 DOM 노드를 설명하는 엘리먼트처럼 컴포넌트를 설명하는 엘리먼트도 엘리먼트입니다. 이들은 서로 중첩되거나 섞일 수 있습니다. 이것이 리액트의 핵심 아이디어입니다.

이 기능을 통해 Button이 DOM <button>으로 렌더링되는지, <div>로 렌더링되는지, 또는 완전히 다른 것으로 렌더링되는지에 대해 신경 쓰지 않고 특정 색상 속성 값을 가진 Button으로 DangerButton 컴포넌트를 정의할 수 있습니다

```js
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: "red",
    children: children,
  },
});
```

하나의 엘리먼트 트리에서 DOM 엘리먼트와 컴포넌트 엘리먼트를 섞어서 사용할 수도 있습니다.

```js
const DeleteAccount = () => ({
  type: "div",
  props: {
    children: [
      {
        type: "p",
        props: {
          children: "Are you sure?",
        },
      },
      {
        type: DangerButton,
        props: {
          children: "Yep",
        },
      },
      {
        type: Button,
        props: {
          color: "blue",
          children: "Cancel",
        },
      },
    ],
  },
});
```

혹은 JSX 로 아래와 같이 표현합니다.

```jsx
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color="blue">Cancel</Button>
  </div>
);
```

이러한 혼합과 매칭은 컴포넌트가 서로 독립적으로 유지되도록 도와줍니다. 이들은 오직 컴포지션을 통해서만 'is-a'와 'has-a' 관계를 표현할 수 있습니다.

- Button은 특정 속성을 가진 DOM <button>입니다.
- DangerButton은 특정 속성을 가진 Button입니다.
- DeleteAccount는 <div> 안에 Button과 DangerButton을 포함합니다.

이처럼 리액트에서는 컴포넌트를 정의하고 사용하는 방식이 매우 유연합니다.  
컴포넌트는 다른 컴포넌트를 포함할 수 있고, 이렇게 함으로써 재사용성과 유지보수성을 높일 수 있습니다.

# Components Encapsulate Element Trees

리액트는 엘리먼트의 `type` 이 함수나 클래스로 주어질때 이 컴포넌트가 `props` 에 따라서 어떤 엘리먼트를 렌더링하는지 파악합니다.

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

예를 들어, 위와 같은 엘리먼트가 있다면 리액트는 Button 이 무엇을 렌더링하는지 파악합니다.

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

Button 이 위와 같은 엘리먼트를 반환하네요.  
이처럼 리액트는 페이지의 모든 컴포넌트에 대해 기본적인 DOM 태그 엘리먼트를 알 때까지 이 과정을 반복합니다.  
즉, 이 과정은 재귀적으로 진행되어 모든 컴포넌트가 실제 DOM 노드로 변환될 때까지 반복됩니다.

이렇게 리액트 컴포넌트는 props를 입력으로 받아 엘리먼트 트리를 출력합니다.  
엘리먼트 트리는 DOM 노드를 설명하는 엘리먼트와 다른 컴포넌트를 설명하는 엘리먼트를 모두 포함할 수 있습니다.
이를 통해 내부 DOM 구조에 의존하지 않고 UI의 독립적인 부분을 구성할 수 있습니다.

개발자는 props 에 따라서 무엇을 그릴지만 설명하면 (엘리먼트 트리), 리액트가 내부적으로 리액트가 내부적으로 인스턴스를 생성, 업데이트, 소멸시키는 등 인스턴스를 관리합니다.  
리액트 엘리먼트를 통해 가상 DOM을 관리하고, 실제 DOM에 필요한 변경 사항을 반영하는 것입니다.

## Components Can Be Classes or Functions

리액트의 컴포넌트는 함수형 컴포넌트로 작성할 수도 있고, React.Component를 상속받는 클래스로 작성할 수도 있습니다.

컴포넌트를 클래스로 정의하면 함수형 컴포넌트보다 더 강력합니다. 클래스 컴포넌트는 로컬 상태를 저장할 수 있고, 해당 DOM 노드가 생성되거나 소멸될 때 커스텀 로직을 수행할 수 있습니다.  
클래스 컴포넌트와 함수형 컴포넌트 모두 개발자가 컴포넌트의 인스턴스를 직접 생성할 필요는 없지만, 클래스 컴포넌트는 리액트가 인스턴스를 생성해줍니다.

또한, 클래스 컴포넌트는 리액트의 생명주기 메소드를 통해 조금 더 복잡한 기능을 구현할 수 있습니다.  
(함수형 컴포넌트로 작성하더라도 훅을 통해 대부분의 생명주기 메서드를 구현할 수 있지만, 일부 생명주기 메서드는 클래스 컴포넌트에서만 사용할 수 있습니다.)

클래스에서만 사용할 수 있는 기능이 필요하지 않다면, 함수형 컴포넌트를 사용하는 것을 권장합니다. 단순하고, 가독성이 좋기 때문입니다.

## Top-Down Reconciliation

```js
// React: You told me this...
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React: ...And Form told me this...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React: ...and Button told me this! I guess I'm done.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

위 코드는 조정 과정의 일부입니다.  
조정이 끝나면, 리액트는 최종적인 DOM 트리를 알고, react-dom이나 react-native 같은 렌더러가 최소한의 변경 사항만 적용하여 DOM 노드(또는 리액트 네이티브의 경우 플랫폼별 뷰)를 업데이트합니다.

컴포넌트 트리의 일부가 너무 커서 리액트가 효율적으로 방문하기 어려워지면, 관련 props가 변경되지 않은 경우 트리의 특정 부분을 이 "세분화" 및 비교(diffing) 과정에서 건너뛰도록 할 수 있습니다. props가 불변인 경우 변경 여부를 계산하는 것이 매우 빠르므로, 리액트와 불변성(immutability)은 함께 잘 작동하며 최소한의 노력으로 훌륭한 최적화를 제공할 수 있습니다.

리액트에서 불변성이 중요한 이유입니다.  
리액트는 얕은 비교를 수행합니다. 따라서, 상태가 업데이트되었을때 정상적으로 UI 에 반영하고 싶다면 불변 객체를 사용해야 합니다. 예를 들어, 배열이나 객체를 수정할 때는 기존의 배열이나 객체를 직접 수정하지 않고, 새로운 배열이나 객체를 생성하는 방식을 사용해야 합니다.  
컴포넌트가 불변 객체를 사용하면, 리액트는 상태나 props가 변경되지 않은 컴포넌트를 건너뛰고, 변경된 컴포넌트만 리렌더링할 수 있습니다. 이는 성능 최적화에 효율적입니다.

만약 불변 객체를 사용하지 않는다면 리액트가 상태 변화를 제대로 감지하지 못하여 DOM 에 반영하지 못할 수 있습니다.
