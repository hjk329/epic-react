# Javascript 로 브라우저에 Hello World 띄우기
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root">Hello World</div>
    <script type="module">
        const root = document.getElementById('root');
        const div = document.createElement('div');
        div.textContent = 'Hello World';
        div.className = 'container';
        root.append(div);   
    </script>
</body>
</html>
```

# Raw React API 로 브라우저에 Hello World 띄우기

```html
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18.1.0/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.1.0/umd/react-dom.development.js"></script>
  <script type="module">
    const rootElement = document.getElementById('root')
    const element = React.createElement('div', {
      className: 'container',
      children: 'Hello World',
    })
    ReactDOM.createRoot(rootElement).render(element)
  </script>
</body>
```


# JSX 를 사용하여 브라우저에 Hello World 띄우기
JSX 는 리액트에서 사용하는 syntax sugar 이고, `Raw React API` 보다 선언적으로 작성할 수 있다.  

하지만, `JSX 는 Javascript 가 아니기 때문에` 브라우저가 이를 해석하기 위해 컴파일 되어야 한다.  
Babel 이 이러한 역할을 한다.  

🐿 Babel 이 JSX 구문을 어떻게 해석하는지 [여기에서](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=App&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBArgSxgXhgHgCYIG4D40QAOAhmLgBICmANtSGgPRGm7rNkDqIATtRo-3wMseAFBA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=true&targets=&version=7.23.10&externalPlugins=&assumptions=%7B%7D) 다양하게 테스트해보세요!  


---
추가할 내용 script type='text/babel' 을 사용한 예제
