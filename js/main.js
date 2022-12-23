'use strict';

// IIFE : 즉시 실행 함수
// 각 스크롤 섹션에 대한 애니메이션 정보를 담은 배열
(() => {
  let scrollY = 0; // window.scrollY 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(스크롤 중인) 섹션
  let enterNewScene = false; // 새로운 섹션에 진입하는 순간 true

  const sceneInfo = [
    {
      // 0
      type: 'sticky',
      heightMultiple: 5, // scrollHeight를 브라우저 높이의 5배로 세팅해주기 위해 배수값 지정
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        // 애니메이션 초기값, 종료값, { 시작 지점, 종료 지점 }
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: 'normal',
      // heightMultiple: 5, // normal type에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      // 2
      type: 'sticky',
      heightMultiple: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
      },
      values: {
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 3
      type: 'sticky',
      heightMultiple: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이를 미리 지정해둔 배수값 만큼 세팅
    sceneInfo.forEach(scene => {
      if (scene.type === 'sticky') {
        scene.scrollHeight = scene.heightMultiple * window.innerHeight;
      } else if (scene.type === 'normal') {
        scene.scrollHeight = scene.objs.container.offsetHeight;
      }
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    });

    scrollY = window.scrollY;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      // 새로 고침 시에도 currentScene이 정확하게 세팅되도록 잡아줌
      // 지나쳐온 섹션들의 누적 높이값이 현재 스크롤값보다 크다면 (새로 고침을 했다면),
      // 높이값을 더 이상 누적하지 않고 반복문 종료 및 currentScene을 현재 섹션으로 설정
      if (totalScrollHeight >= scrollY) {
        currentScene = i;
        break;
      }
    }
  }

  // 애니메이션 실행 시 변화될 값들을 계산
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

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentScrollY = scrollY - prevScrollHeight; // 현재 섹션에서의 스크롤값
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentScrollY / scrollHeight; // currentScrollY를 비율로 나타낸 변수

    // 애니메이션 정보와 현재 섹션에서의 스크롤값을 매개변수로 전달
    // 전달한 값들을 토대로 calcValues에서 계산 후, 계산된 값을 css style에 적용
    switch (currentScene) {
      case 0:
        // console.log('1 play');
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentScrollY); // 0 ~ 1
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentScrollY)}%)`; // 20 ~ 0
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentScrollY); // 1 ~ 0
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentScrollY)}%)`; // 0 ~ -20
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentScrollY);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentScrollY)}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentScrollY);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentScrollY)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentScrollY);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentScrollY)}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentScrollY);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentScrollY)}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentScrollY);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentScrollY)}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentScrollY);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentScrollY)}%, 0)`;
        }
        break;
      case 2:
        // console.log('2 play');
        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentScrollY);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentScrollY)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentScrollY);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentScrollY)}%, 0)`;
        }

        if (scrollRatio <= 0.57) {
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentScrollY)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentScrollY);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentScrollY)})`;
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentScrollY)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentScrollY);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentScrollY)})`;
        }

        if (scrollRatio <= 0.83) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentScrollY)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentScrollY);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentScrollY)})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentScrollY)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentScrollY);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentScrollY)})`;
        }
        break;
      case 3:
        // console.log('3 play');
        break;
    }
  }

  // 몇 번째 섹션이 스크롤 중인지를 판별
  function scrollLoop() {
    enterNewScene = false;
    // 현재 위치를 기준으로, 이전에 위치한 섹션들의 높이값
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    // console.log(prevScrollHeight);

    // 현재 스크롤값이 이전 섹션들의 높이값과 현재 활성화된 섹션의 높이값의 합보다 크다면 currentScene + 1
    if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
    } else if (scrollY < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
    }
    // console.log(currentScene);
    if (enterNewScene) return; // 새로운 섹션에 진입한 찰나의 순간에만 애니메이션 막아줌 (오차 방지)
    playAnimation();
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollLoop();
  });
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout);
})();
