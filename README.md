![apple](https://user-images.githubusercontent.com/110226567/213878791-c39e31ca-01e6-4728-b8b9-9374b6249ba0.png)

# 🍎 Apple

Apple iPad 제품 소개 페이지 👉 [Demo](https://gardenny.github.io/apple/)

<br />

## 📢 프로젝트 개요

Apple 웹사이트에서 자주 사용되는 고급 인터랙션 기법 클론 코딩 사이트입니다.<br />
스크롤값을 이용한 키프레임 및 캔버스를 활용한 다양한 애니메이션이 구현되어 있습니다.<br />
동적 요소를 극대화하여 웹 프로젝트를 대표할 수 있는 화려한 사이트를 만들어보고자 제작하게 되었습니다.

<br />

## 🗨️ 사용 기술

<p>
  <img src="https://img.shields.io/badge/HTML-e34f26?style=flat-square&logo=HTML5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS-1572b6?style=flat-square&logo=CSS3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-f7df1e?style=flat-square&logo=JavaScript&logoColor=white"/>
</p>

<br />

## 📋 주요 기능

- 고정된 위치에서 지정된 타이밍에 등장하는 텍스트
- 스크롤값에 따라 제어되는 고해상도 비디오 인터랙션
- 이미지 블렌딩 및 캔버스 스케일 드로우 애니메이션
- 스크롤에 반응하여 배경이 블러 처리되는 메뉴바
- svg 태그와 css keyframe을 활용한 로딩 스피너

<br />

## 💻 소스 코드

전체 코드 보러 가기 👉 [Notion](https://imjone.notion.site/Apple-ba7b279ed3c643eb88a3439cb004d3c3?pvs=4)

### 📍 애니메이션 정보 객체 배열 정의

애니메이션과 관련된 정보를 담은 배열을 미리 정의해두었습니다.<br />
세팅될 높이 값 및 애니메이션 시작 지점, 종료 지점 등이 해당됩니다.

```javascript
const sceneInfo = [
  {
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-3'),
      canvasCaption: document.querySelector('.canvas-caption'),
      canvas: document.querySelector('.image-blend-canvas'),
      ctx: document.querySelector('.image-blend-canvas').getContext('2d'),
      imagesPath: ['img/blend-image-1.jpg', 'img/blend-image-2.jpg'],
      images: [],
    },
    values: {
      rect1X: [0, 0, { start: 0, end: 0 }],
      rect2X: [0, 0, { start: 0, end: 0 }],
      rectStartY: 0,
      blendHeight: [0, 0, { start: 0, end: 0 }],
      canvas_scale: [0, 0, { start: 0, end: 0 }],
      canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
      canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
    },
  },
  ...
];
```

### 📍 애니메이션 계산 함수

애니메이션 정보와 현재 스크롤값을 인자로 전달하여 호출하면,<br />
애니메이션 실행 시 변화될 값들을 계산하여 리턴해주는 함수입니다.

```javascript
function calcValues(values, currentScrollY) {
  let value;

  // 현재 섹션에서 스크롤 된 값의 범위를 비율로 구하기
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  const scrollRatio = currentScrollY / scrollHeight;

  if (values.length === 3) {
    // start ~ end : 애니메이션 구간
    const partScrollStart = values[2].start * scrollHeight; // 애니메이션 시작 지점
    const partScrollEnd = values[2].end * scrollHeight; // 애니메이션 끝나는 지점
    const partScrollHeight = partScrollEnd - partScrollStart;

    // 애니메이션 구간 진입 시에만 애니메이션 실행
    if (currentScrollY >= partScrollStart && currentScrollY <= partScrollEnd) {
      value = ((currentScrollY - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
    } else if (currentScrollY < partScrollStart) {
      value = values[0];
    } else if (currentScrollY > partScrollEnd) {
      value = values[1];
    }
  } else {
    // 현재 섹션에서 스크롤 된 값의 비율 * 애니메이션 진행 범위 + 초기값 (애니메이션이 시작 지점)
    value = scrollRatio * (values[1] - values[0]) + values[0];
  }
  return value;
}
```

### 📍 애니메이션 실행 함수

현재 섹션에서의 스크롤값을 구하여 `calcValues` 함수를 호출하고,<br />
리턴된 값을 토대로 각 섹션에 맞는 CSS 스타일을 적용해주는 함수입니다.

```javascript
function playAnimation() {
  const objs = sceneInfo[currentScene].objs;
  const values = sceneInfo[currentScene].values;
  const currentScrollY = scrollY - prevScrollHeight; // 현재 섹션에서의 스크롤값
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  const scrollRatio = currentScrollY / scrollHeight; // currentScrollY를 비율로 나타낸 변수

  switch (currentScene) {
    case 0:
      objs.ctx.drawImage(objs.images[0], 0, 0);
      objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentScrollY);

      if (scrollRatio <= 0.22) {
        // in
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentScrollY); // 0 ~ 1
        objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentScrollY)}%)`; // 20 ~ 0
      } else {
        // out
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentScrollY); // 1 ~ 0
        objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentScrollY)}%)`; // 0 ~ -20
      }
      break;
      ...
  }
}
```

<br />

## 😊 배운 점 및 느낀 점

- 난이도 있는 인터랙티브 웹 개발에 대한 눈이 조금은 트인 것 같습니다.
- 핵심 기능에 대한 아이디어를 구현하고 복잡한 위치 및 크기 계산 연습을 해볼 수 있었습니다.
- 별도의 라이브러리 사용 없이 원리에 입각하여 스크롤 인터랙션 구현 과정을 이해할 수 있었습니다.
