import React, { useState, useRef } from 'react';
import './Magnifier.css';  // 引入样式文件

const Magnifier = () => {
  const [activeImage, setActiveImage] = useState('public/img/1.jpg');
  const [maskPosition, setMaskPosition] = useState({ left: 75, top: 25 });
  const showRef = useRef(null);
  const bigRef = useRef(null);
  const maskRef = useRef(null);

  const handleMouseMove = (e) => {
    if (showRef.current) {
      const showRect = showRef.current.getBoundingClientRect();
      const x = e.pageX - showRect.left - maskRef.current.offsetWidth / 2;
      const y = e.pageY - showRect.top - maskRef.current.offsetHeight / 2;

      let newX = x < 75 ? 75 : x > 225 ? 225 : x;
      let newY = y < 25 ? 25 : y > 275 ? 275 : y;

      setMaskPosition({ left: newX, top: newY });

      // Update the background position for the zoom effect
      if (bigRef.current) {
        const ratio = bigRef.current.offsetWidth / maskRef.current.offsetWidth;
        bigRef.current.style.backgroundPosition = `-${(newX - 75) * (1500 / 325)}px -${(newY - 25) * (1500 / 340)}px`;
      }
    }
  };

  const handleMouseOut = () => {
    if (bigRef.current) {
      bigRef.current.classList.remove('active');
    }
  };

  const handleImageClick = (e) => {
    const clickedImage = e.target;
    if (clickedImage.tagName.toLowerCase() === 'img') {
      setActiveImage(clickedImage.src);
      if (bigRef.current) {
        bigRef.current.style.backgroundImage = `url(${clickedImage.src})`;
      }
    }
  };

  return (
    <div className="box">
      <div className="show" ref={showRef} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
        <div className="mask" ref={maskRef} style={{ left: maskPosition.left, top: maskPosition.top }} />
        <img src={activeImage} alt="Zoomed" />
      </div>

      <div className="small" onClick={handleImageClick}>
        <img className="active" src="public/img/1.jpg" alt="Thumbnail 1" />
        <img src="public/img/2.jpg" alt="Thumbnail 2" />
      </div>

      <div className="big" ref={bigRef} style={{ backgroundImage: `url(${activeImage})` }} />
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