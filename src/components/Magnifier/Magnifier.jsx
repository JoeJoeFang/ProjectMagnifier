import React, { useState, useRef } from 'react';
import './Magnifier.css';  // 引入样式文件
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';
import image5 from './images/5.jpg';

const Magnifier = () => {
  const [activeImage, setActiveImage] = useState(image1);
  const [maskPosition, setMaskPosition] = useState({ left: 0, top: 0 });

  const showRef = useRef(null);   // 小图容器
  const bigRef = useRef(null);    // 放大镜容器（背景显示）
  const maskRef = useRef(null);   // 遮罩
  const imgRef  = useRef(null);   // 小图 <img>

  // 保存大图原始像素
  const bigNatural = useRef({ w: 0, h: 0 });

  // 小图加载后，同步大图信息
  const handleImgLoad = () => {
    const img = imgRef.current;
    if (!img || !bigRef.current) return;
    bigNatural.current = { w: img.naturalWidth, h: img.naturalHeight };

    const big = bigRef.current;
    big.style.backgroundImage = `url(${img.src})`;
    big.style.backgroundRepeat = "no-repeat";
    big.style.backgroundSize = `${bigNatural.current.w}px ${bigNatural.current.h}px`;
    big.classList.remove("active"); // 初始隐藏
  };

  const handleMouseMove = (e) => {
    const showEl = showRef.current;
    const maskEl = maskRef.current;
    const bigEl  = bigRef.current;
    const imgEl  = imgRef.current;
    if (!showEl || !maskEl || !bigEl || !imgEl) return;
  
    const rect = showEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const lensW = maskEl.offsetWidth;
    const lensH = maskEl.offsetHeight;
  
    // —— 用图片的实际显示区域来计算 —— //
    const imgRect = imgEl.getBoundingClientRect();
    const imgW = imgRect.width;
    const imgH = imgRect.height;
    const offsetLeft = imgRect.left - rect.left;
    const offsetTop  = imgRect.top  - rect.top;
  
    // 以鼠标为中心的初值
    let lensLeft = x - lensW / 2;
    let lensTop  = y - lensH / 2;
  
    // 夹取到“图片可见区域”内（不是整个容器）
    lensLeft = Math.max(offsetLeft, Math.min(offsetLeft + imgW - lensW, lensLeft));
    lensTop  = Math.max(offsetTop,  Math.min(offsetTop  + imgH - lensH, lensTop));
  
    setMaskPosition({ left: lensLeft, top: lensTop });
  
    // 比例：大图像素 / 图片可见宽高
    const bigW = bigNatural.current.w || imgEl.naturalWidth;
    const bigH = bigNatural.current.h || imgEl.naturalHeight;
    const scaleX = bigW / imgW;
    const scaleY = bigH / imgH;
  
    // 将遮罩左上角映射到“图片内部”的坐标（去掉留白偏移）
    const lensLeftOnImg = lensLeft - offsetLeft;
    const lensTopOnImg  = lensTop  - offsetTop;
  
    // 背景偏移（与遮罩方向相反）
    let bgX = -lensLeftOnImg * scaleX;
    let bgY = -lensTopOnImg  * scaleY;
  
    // 放大镜窗口尺寸 & clamp，避免右/下留白
    const zoomW = bigEl.clientWidth;
    const zoomH = bigEl.clientHeight;
    const minBgX = zoomW - bigW;  // <= 0
    const minBgY = zoomH - bigH;  // <= 0
    bgX = Math.max(minBgX, Math.min(0, bgX));
    bgY = Math.max(minBgY, Math.min(0, bgY));
  
    bigEl.style.backgroundPosition = `${bgX}px ${bgY}px`;
    bigEl.classList.add("active");
  };

  const handleMouseOut = () => {
    if (bigRef.current) bigRef.current.classList.remove("active");
  };

  const handleImageClick = (e) => {
    const clickedImage = e.target;
    if (clickedImage.tagName.toLowerCase() !== "img") return;

    // 更新缩略图激活态
    const parent = clickedImage.parentElement?.parentElement;
    if (parent) {
      Array.from(parent.querySelectorAll(".small-img")).forEach((node) =>
        node.classList.remove("active")
      );
      clickedImage.parentElement.classList.add("active");
    }

    // 切换大图，等待 onLoad 更新 naturalWidth/Height
    setActiveImage(clickedImage.src);
  };

  return (
    <div className="box">
      <div className="box-left">
        <div
          className="show"
          ref={showRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseOut}
        >
          <h1>Hover here to zoom in ⤵</h1>
          <div
            className="mask"
            ref={maskRef}
            style={{ left: maskPosition.left, top: maskPosition.top }}
          />
          <img ref={imgRef} src={activeImage} alt="Zoomed" onLoad={handleImgLoad} />
        </div>

        <div className="small" onClick={handleImageClick}>
          <div className="small-div">
            <div className="small-img active">
              <img className="img-short" src={image1} alt="Thumbnail 1" />
            </div>
            <div className="small-img">
              <img className="img-short" src={image2} alt="Thumbnail 2" />
            </div>
            <div className="small-img">
              <img className="img-short" src={image3} alt="Thumbnail 3" />
            </div>
            <div className="small-img">
              <img className="img-short" src={image4} alt="Thumbnail 4" />
            </div>
            <div className="small-img">
              <img className="img-short" src={image5} alt="Thumbnail 5" />
            </div>
          </div>
        </div>
      </div>

      <div className="box-right">
        {/* 注意：big 的宽高需要在 CSS 里定死或相对父容器明确，否则无法正确 clamp */}
        <div className="big" ref={bigRef} />
      </div>
    </div>
  );
};

export default Magnifier;




// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Document</title>
//   <link rel="stylesheet" href="放大镜.css">
  
// </head>
// <body>
//   <div class="box">
//     <div class="show">
//       <div class="mask">
        
//       </div>
//       <img src="public/img/1.jpg" alt="">
//     </div>
//     <div class="small">
//       <img class="active" src="public/img/1.jpg" alt="">
//       <img src="public/img/2.jpg" alt="">
//     </div>
//     <div class="big"></div>
//   </div>

//   <script>
//     function Show(ele){
//       console.log(ele)
//       this.box = document.querySelector(ele)
//       console.log(this.box)
//       this.show = this.box.querySelector('.show')
//       this.big = this.box.querySelector('.big')
//       this.img = this.show.querySelector('img')
//       this.mask = this.show.querySelector('.mask')
//       this.small = this.box.querySelector('.small')
//       this.img.addEventListener('mouseout', ()=>{
//         this.big.classList.remove('active')
//       })
//     }
//     Show.prototype.mouseMove = function(){
//       this.show.addEventListener('mousemove', (e)=>{
//         this.big.classList.add('active')
//         console.log(e.pageX, e.pageY, this.show.offsetWidth, this.show.offsetHeight)
//         let x = e.pageX - this.mask.offsetWidth*1.5
//         let y = e.pageY - this.mask.offsetHeight*1.5
//         console.log(x, y)
//         if(x < 75) x = 75
//         if(y < 25) y = 25
//         if(x > 225) x = 225
//         if(y > 275) y = 275
//         this.mask.style.left = x + 'px'
//         this.mask.style.top = y + 'px'
//         const ratio = this.big.offsetWidth / this.mask.offsetWidth
//         console.log(this.big.backgroundSize)
//         this.big.style.backgroundPosition = `-${(x-75)*(1500/325)}px -${(y-25)*(1500/340)}px`
//     })}
//     Show.prototype.select = function(){
//       this.small.addEventListener("click", e=>{
//         console.log(e.target)
//         if (e.target.tagName.toLowerCase() === 'img'){
//           e.target.parentNode.querySelector('.active').classList.remove('active')
//           e.target.classList.add('active')
//           this.img.src = e.target.src
//           this.big.style.backgroundImage = `url(${e.target.src})`
//         }
//       })
//     }
//     let e = new Show('.box')
//     e.mouseMove()
//     e.select()


//   </script>
// </body>
// </html>