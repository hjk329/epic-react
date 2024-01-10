# Lazy State Initialization

만약 `useState` 의 초깃값으로 비싼 연산값을 두면 렌더링될때마다 비싼 연산을 해야 한다.  

하지만, 최초 렌더링이된 이후에는 초깃값의 의미가 없어질 수도 있다!   

최초 렌더링시에 단 한번만 초깃값을 셋팅해주기 위해 `Lazy Initialization` 을 사용할 수 있다.  

```js

// 02.js

function Greeting({initialName = ''}) {

console.log('rendering') // 렌더링될때마다 계속 찍힘

function getInitialName() {
  console.log('getting initial name') // 최초 렌더링 1회만 찍힘
  return window.localStorage.getItem('name') || initialName
}
  const [name, setName] = React.useState(getInitialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}
```

```js

// 02.js

function Greeting({initialName = ''}) {

  const [name, setName] = React.useState(()=>window.localStorage.getItem('name') || initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}
```

**비싼 연산값을 초깃값으로 설정하는데 렌더링될때마다 초깃값 설정이 필요하지 않은 상황이라면 `Lazy Initialization` 을 사용하자!**
