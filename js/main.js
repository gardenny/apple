'use strict';

// IIFE : 즉시 실행 함수
// 각 스크롤 섹션에 대한 애니메이션 정보를 담은 배열
(() => {
  let scrollY = 0; // window.scrollY 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(스크롤 중인) 섹션
  let enterNewScene = false; // 새로운 섹션에 진입하는 순간 true

  let accel = 0.1; // 이동 거리 (가속도 역할)
  let delayedScrollY = 0; // 현재 지점
  let rafId;
  let rafState;

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
        canvas: document.querySelector('#video-canvas-0'),
        ctx: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [], // 비디오 프레임(이미지 시퀀스)을 담을 배열
      },
      values: {
        videoImageCount: 307,
        imageSequence: [0, 306],

        // 애니메이션 초기값, 종료값, { 시작 지점, 종료 지점 }
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
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
        canvas: document.querySelector('#video-canvas-2'),
        ctx: document.querySelector('#video-canvas-2').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 291,
        imageSequence: [0, 290],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
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
  ];

  function setCanvasImages() {
    let imgElem1;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem1 = document.createElement('img');
      imgElem1.src = `video/section-0/scene(${i + 1}).jpg`;
      sceneInfo[0].objs.videoImages.push(imgElem1);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = document.createElement('img');
      imgElem2.src = `video/section-2/scene(${i + 1}).jpg`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = document.createElement('img');
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  function checkMenu() {
    const globalNavHegiht = document.querySelector('.global-nav').getBoundingClientRect().height;
    if (scrollY > globalNavHegiht) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

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
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080; // canvas 높이 대비 브라우저 높이의 비율
    sceneInfo[0].objs.canvas.style.transform = `translate3D(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3D(-50%, -50%, 0) scale(${heightRatio})`;
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
        // console.log('0 play');
        // let sequence1 = Math.round(calcValues(values.imageSequence, currentScrollY));
        // objs.ctx.drawImage(objs.videoImages[sequence1], 0, 0);
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
        // let sequence2 = Math.round(calcValues(values.imageSequence, currentScrollY));
        // objs.ctx.drawImage(objs.videoImages[sequence2], 0, 0);

        if (scrollRatio <= 0.5) {
          // in
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentScrollY);
        } else {
          // out
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentScrollY);
        }
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

        // currentScene2가 끝나갈 때쯤부터 currentScene3의 캔버스를 미리 그려주기 시작
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }
          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.ctx.fillStyle = 'white';
          objs.ctx.drawImage(objs.images[0], 0, 0);

          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight = document.body.offsetHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          objs.ctx.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
          objs.ctx.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
        }
        break;
      case 3:
        // console.log('3 play');
        let step = 0;

        // 가로 세로 모두 꽉 차게 하기 위해 여기서 세팅 (게산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio; // 캔버스 scale 조정 비율

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.ctx.fillStyle = 'white';
        objs.ctx.drawImage(objs.images[0], 0, 0);

        // 캔버스 비율에 맞춰서 innerWidth, innerHeight 다시 계산
        // 캔버스 비율(scale값)을 브라우저 비율에 맞춰서 줄여놓았으므로
        // 흰색 박스가 줄어든 캔버스의 양쪽에서 정확하게 시작할 수 있도록 하기 위함
        // 스크롤바의 영향을 받지 않도록 window.inner~ 대신 document.body.offset~ 사용
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        const recalculatedInnerHeight = document.body.offsetHeight / canvasScaleRatio;
        // console.log(recalculatedInnerWidth, recalculatedInnerHeight);

        // 섹션 3이 시작되었을 때의 흰색 박스 y값을 최초 1회만 할당
        if (!values.rectStartY) {
          values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          // console.log(values.rectStartY);
          values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        // 흰색 박스 좌표 세팅
        const whiteRectWidth = recalculatedInnerWidth * 0.15;
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // 흰색 박스가 화면에 처음 그려지는 시작점, 첫 x 좌표
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 브라우저가 스크롤 되어 흰색 박스가 화면 밖으로 완전히 나갔을 때의 최종 x 좌표
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        // 좌우 흰색 박스 그리기
        objs.ctx.fillRect(parseInt(calcValues(values.rect1X, currentScrollY)), 0, parseInt(whiteRectWidth), objs.canvas.height);
        objs.ctx.fillRect(parseInt(calcValues(values.rect2X, currentScrollY)), 0, parseInt(whiteRectWidth), objs.canvas.height);

        // 캔버스가 브라우저 상단에 닿지 않았다면
        if (scrollRatio < values.rect1X[2].end) {
          // console.log('캔버스 닿기 전');
          step = 1;
          objs.canvas.classList.remove('sticky');
        } else {
          // console.log('캔버스 닿은 후');
          step = 2;
          objs.canvas.classList.add('sticky');
          objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

          // 이미지 블렌드
          // 3-1 애니메이션 종료 지점 === 3-2 애니메이션 시작 지점
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end; // step2가 되는 순간 이미지 블렌드 시작
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // 이미지 블렌드 시작 후, 전체 구간의 20% 동안 애니메이션이 이뤄진 다음 종료
          const blendHeight = parseInt(calcValues(values.blendHeight, currentScrollY));
          // console.log(blendHeight);

          // prettier-ignore
          // 캔버스 높이 - 스크롤값에 따라 새로 그려지는 이미지의 높이 = 이미지의 실시간 y 좌표
          objs.ctx.drawImage(objs.images[1],
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
          );

          // 이미지 블렌드 종료 후
          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            // 분수이므로 분모의 값을 증가시켜서 결과값이 더 작게 나오도록 만들어줌
            values.canvas_scale[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; // 0.2 === animation duration

            objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentScrollY)})`;
            objs.canvas.style.marginTop = 0; // position: fixed인 상태로 스크롤하는 동안에는 margin 적용되지 않게끔
          }

          // 캔버스 축소 종료 후
          if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
            objs.canvas.classList.remove('sticky');
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // position: fixed인 상태에서 스크롤한 값만큼 margin-top 적용

            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
            values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;

            objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentScrollY);
            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentScrollY)}%, 0)`;
          }
        }
        break;
    }
  }

  // 몇 번째 섹션이 스크롤 중인지를 판별
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 현재 위치를 기준으로, 이전에 위치한 섹션들의 높이값
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    // console.log(prevScrollHeight);

    // 현재 스크롤값이 이전 섹션들의 높이값과 현재 활성화된 섹션의 높이값의 합보다 크다면 currentScene + 1
    if (delayedScrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    } else if (delayedScrollY < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    // console.log(currentScene);

    if (enterNewScene) return; // 새로운 섹션에 진입한 찰나의 순간에만 애니메이션 막아줌 (오차 방지)
    playAnimation();
  }

  function loop() {
    // 현재 지점 + (목표 지점 - 현재 지점) * 이동 거리
    delayedScrollY = delayedScrollY + (scrollY - delayedScrollY) * accel;

    // 새로운 scene에 진입했을 때의 requestAnimationFrame 계산 오차 방지
    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentScrollY = delayedScrollY - prevScrollHeight; // 가속도가 적용된 delayedScrollY를 사용하여 스크롤을 부드럽게
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;

        let sequence = Math.round(calcValues(values.imageSequence, currentScrollY));
        if (objs.videoImages[sequence]) {
          objs.ctx.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }
    rafId = requestAnimationFrame(loop);

    // 현재 지점이 목표 지점을 넘어버린다면
    // 음수가 나올 수 있기 때문에 Math.abs를 통해 절대값으로 제어
    if (Math.abs(scrollY - delayedScrollY) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener('load', () => {
    setLayout();
    sceneInfo[0].objs.ctx.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollLoop();
    checkMenu();

    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setLayout();
    sceneInfo[3].values.rectStartY = 0; // window resize 시 흰색 박스의 시작 지점 초기화
  });
  window.addEventListener('orientationchange', setLayout);

  setCanvasImages();
})();
