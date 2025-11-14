// Shared script for blow and envelope interactions

// Blow button behavior - candle off, music fade, then go to envelope page
document.addEventListener('DOMContentLoaded', ()=> {
  const blowBtn = document.getElementById('blowBtn');
  if(blowBtn){
    blowBtn.addEventListener('click', async function(){
      const candle = document.getElementById('candle');
      // switch image to off (if exists)
      candle && (candle.src = 'candle_off.png');
      candle && (candle.style.animation = 'none');
      // fade out music if present
      try{
        const aud = window._birthdayMusic;
        if(aud){
          let vol = aud.volume;
          const fade = setInterval(()=>{ vol -= 0.08; if(vol<=0.02){ aud.pause(); clearInterval(fade);} else aud.volume = Math.max(0,vol); },120);
        }
      }catch(e){}
      // small delay then go to envelope
      setTimeout(()=> location.href='letter.html', 1200);
    });
  }

  // Envelope swipe-up to open with flip animation (on envelope.html)
  const env = document.getElementById('envelope');
  const flap = document.getElementById('flap');
  if(env && flap){
    let startY = null;
    let current = 0;
    let opened = false;

    const onStart = (e) => {
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
    };
    const onMove = (e) => {
      if(startY===null) return;
      const y = (e.touches ? e.touches[0].clientY : e.clientY);
      const delta = startY - y;
      if(delta < 0) return; // only swipe up
      const percent = Math.min(1, delta / 180);
      // rotate flap by percent * -120deg
      const deg = -percent * 120;
      flap.style.transform = `rotateX(${deg}deg)`;
      flap.style.transition = 'transform 0s';
      current = percent;
      // hint opacity
      const hint = document.getElementById('hint');
      if(hint) hint.style.opacity = String(Math.max(0, 1 - percent*1.6));
    };
    const onEnd = (e) => {
      if(startY===null) return;
      if(current > 0.45 && !opened){
        // complete open
        flap.style.transition = 'transform 400ms cubic-bezier(.2,.9,.3,1)';
        flap.style.transform = 'rotateX(-120deg)';
        opened = true;
        // after animation, navigate to letter content (same page replacement)
        setTimeout(()=> location.href='letter.html', 600);
      }else{
        // reset
        flap.style.transition = 'transform 300ms ease';
        flap.style.transform = 'rotateX(0deg)';
        const hint = document.getElementById('hint');
        if(hint) hint.style.opacity = '1';
      }
      startY = null; current = 0;
    };

    env.addEventListener('touchstart', onStart, {passive:true});
    env.addEventListener('touchmove', onMove, {passive:true});
    env.addEventListener('touchend', onEnd);
    env.addEventListener('mousedown', onStart);
    env.addEventListener('mousemove', onMove);
    env.addEventListener('mouseup', onEnd);
  }
});
