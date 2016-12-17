window.onload = function(){
  const app = document.getElementById('app');
  var audio = new Audio("../audio/gacha_result.mp3");
  audio.play();
  
  const myRand = () =>{
    let r = 50;
    while(40 < r && r < 60){
      r = Math.random() * 100;
    }
    return r;
  }

  for(let i=0;i<50;i++){
    const delay = Math.random() + 's';
    const el = document.createElement('span');
    el.innerHTML = '*';
    el.className = "glitter-star";
    el.style.top = myRand() + 'vh';
    el.style.left = myRand() + 'vw';
    el.style.animationDelay = delay;
    el.style.msAnimationDelay = delay;
    el.style.webkitAnimationDelay = delay;
    el.style.monAnimationDelay = delay;
    app.appendChild(el);
    console.log(el);
  }

}
