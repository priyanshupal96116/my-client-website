
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs={}, content="") => {
    const e = document.createElementNS(NS, tag);
    for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
    if (content !== "") e.textContent = content;
    return e;
  };

  document.querySelectorAll(".gyanora-animation-lab").forEach(card => {
    if (card.dataset.ready) return;
    card.dataset.ready = "yes";

    const kind = card.dataset.kind;
    const svg = card.querySelector("svg");
    const slider = card.querySelector("input");
    const output = card.querySelector(".lab-readout");
    const play = card.querySelector("[data-play]");
    const reset = card.querySelector("[data-reset]");
    let timer = null;

    const add = (tag, attrs, content) => {
      const e = el(tag, attrs, content);
      svg.appendChild(e);
      return e;
    };
    const line = (x1,y1,x2,y2,color="#475569",w=1) =>
      add("line",{x1,y1,x2,y2,stroke:color,"stroke-width":w});
    const label = (x,y,s,size=15,color="#e2e8f0") =>
      add("text",{x,y,fill:color,"font-size":size,
        "text-anchor":"middle","font-family":"system-ui"},s);
    const dot = (x,y,r=7,color="#a78bfa") =>
      add("circle",{cx:x,cy:y,r,fill:color,stroke:"#fff","stroke-width":2});

    function draw() {
      const n = Number(slider.value);
      svg.replaceChildren();
      let message = "";

      if (kind === "coordinates") {
        const ox=300, oy=130, step=22;
        const x=n-5;
        const y=Math.round(Math.sin(n/2)*3);

        for(let i=-5;i<=5;i++) {
          const gx=ox+i*step, gy=oy-i*step;
          line(gx,20,gx,240,"#e2e8f0",1);
          line(190,gy,410,gy,"#e2e8f0",1);
          if(i!==0) {
            label(gx,oy+17,String(i),11,"#64748b");
            label(ox-15,gy+4,String(i),11,"#64748b");
          }
        }

        line(175,oy,425,oy,"#334155",2);
        line(ox,245,ox,15,"#334155",2);
        label(432,oy+5,"X",13,"#334155");
        label(ox+12,13,"Y",13,"#334155");
        label(ox-12,oy+15,"O",11,"#334155");

        const px=ox+x*step, py=oy-y*step;
        line(px,py,px,oy,"#f59e0b",2);
        line(ox,py,px,py,"#f59e0b",2);
        dot(px,py,8,"#4f46e5");
        label(px,py-15,`P (${x}, ${y})`,14,"#4338ca");
        label(px,oy+34,`x=${x}`,11,"#b45309");
        label(ox-32,py+4,`y=${y}`,11,"#b45309");
        message=`Point P is at (${x}, ${y}). Follow the guides to read x and y.`;

      } else if (kind === "polynomial") {
        const x=n-5, value=2*x+3;
        line(70,190,550,190,"#cbd5e1",1);
        line(310,35,310,215,"#cbd5e1",1);
        for(let i=-5;i<=5;i++) {
          const px=310+i*38;
          line(px,185,px,195,"#64748b",1);
          label(px,208,String(i),11,"#475569");
        }
        const px=310+x*38, py=190-value*9;
        line(70,190,550,190,"#334155",2);
        line(310,35,310,215,"#334155",2);
        line(px,py,px,190,"#f59e0b",2);
        dot(px,py,7,"#4f46e5");
        label(310,25,"y = 2x + 3",17,"#4338ca");
        label(px,Math.max(48,py-14),`(${x}, ${value})`,13,"#4338ca");
        label(310,245,`2 × ${x} + 3 = ${value}`,16,"#b45309");
        message=`When x = ${x}, 2x + 3 = ${value}.`;

      } else if (kind === "numberline") {
        const selected=n-5;
        line(55,130,565,130,"#334155",3);
        for(let i=-5;i<=5;i++) {
          const px=310+i*45;
          line(px,118,px,142,"#64748b",2);
          label(px,160,String(i),13,"#475569");
        }
        const px=310+selected*45;
        dot(px,130,9,"#4f46e5");
        label(px,98,`(${selected})`,14,"#4338ca");
        label(310,45,"Number Line",18,"#4338ca");
        message=`Selected number: ${selected}.`;

      } else if (kind === "identity") {
        const a=n+2, b=8-n/2, u=12, x=150, y=45;
        add("rect",{x,y,width:(a+b)*u,height:(a+b)*u,
          fill:"#fff",stroke:"#334155","stroke-width":2});
        add("rect",{x,y,width:a*u,height:a*u,
          fill:"#a5b4fc",stroke:"#4f46e5","stroke-width":1.5});
        add("rect",{x:x+a*u,y,width:b*u,height:a*u,
          fill:"#bae6fd",stroke:"#0284c7","stroke-width":1.5});
        add("rect",{x,y:y+a*u,width:a*u,height:b*u,
          fill:"#bae6fd",stroke:"#0284c7","stroke-width":1.5});
        add("rect",{x:x+a*u,y:y+a*u,width:b*u,height:b*u,
          fill:"#fde68a",stroke:"#b45309","stroke-width":1.5});
        label(x+a*u/2,y+a*u/2+5,`a²=${a*a}`,13,"#312e81");
        label(x+a*u+b*u/2,y+a*u/2+5,`ab=${a*b}`,12,"#075985");
        label(x+a*u/2,y+a*u+b*u/2+5,`ab=${a*b}`,12,"#075985");
        label(x+a*u+b*u/2,y+a*u+b*u/2+5,`b²=${b*b}`,12,"#92400e");
        label(300,235,`a=${a}, b=${b}`,15,"#334155");
        label(300,255,`(a+b)² = ${(a+b)**2}`,16,"#4338ca");
        message=`a=${a}, b=${b}. Total square area = ${(a+b)**2}.`;

      } else if (kind === "geometry") {
        const angle=25+n*10, r=angle*Math.PI/180;
        const A=[110,210], B=[510,210],
              C=[110+220*Math.cos(r),210-220*Math.sin(r)];
        add("polygon",{points:`${A} ${B} ${C}`,
          fill:"#c4b5fd55",stroke:"#7c3aed","stroke-width":2.5});
        line(A[0],A[1],B[0],B[1],"#2563eb",2);
        line(A[0],A[1],C[0],C[1],"#0d9488",2);
        line(B[0],B[1],C[0],C[1],"#ea580c",2);
        dot(...A,5,"#2563eb"); dot(...B,5,"#ea5800"); dot(...C,5,"#0d9488");
        label(95,232,"A"); label(525,232,"B");
        label(C[0],C[1]-12,"C");
        label(300,25,`Angle A = ${angle}°`,17,"#4338ca");
        label(300,250,`A + B + C = 180°`,15,"#475569");
        message=`Angle A = ${angle}°. Triangle angles total 180°.`;

      } else if (kind === "mensuration") {
        const angle=n*12;
        const g=add("g",{transform:`translate(300 130) rotate(${angle})`});
        g.appendChild(el("polygon",{points:"-90,-50 30,-50 90,0 -30,0",
          fill:"#c4b5fd",stroke:"#6d28d9","stroke-width":2}));
        g.appendChild(el("polygon",{points:"-90,-50 -30,0 -30,85 -90,35",
          fill:"#7dd3fc",stroke:"#0369a1","stroke-width":2}));
        g.appendChild(el("polygon",{points:"-30,0 90,0 90,85 -30,85",
          fill:"#fcd34d",stroke:"#b45309","stroke-width":2}));
        label(300,24,"Prism: 3D shape",17,"#4338ca");
        label(300,245,`Rotation: ${angle}°`,16,"#475569");
        message=`The prism illustration has rotated ${angle}°.`;

      } else if (kind === "probability") {
        const heads=n%2===0, die=n%6+1;
        dot(190,125,43,heads?"#fbbf24":"#38bdf8");
        label(190,135,heads?"H":"T",28,"#1e293b");
        label(190,190,heads?"Heads":"Tails",15,"#334155");
        label(190,215,"Coin: 1/2 each",12,"#475569");
        add("rect",{x:340,y:75,width:100,height:100,rx:12,
          fill:"#fff",stroke:"#7c3aed","stroke-width":3});
        const patterns={
          1:[[50,50]],2:[[25,25],[75,75]],
          3:[[25,25],[50,50],[75,75]],
          4:[[25,25],[75,25],[25,75],[75,75]],
          5:[[25,25],[75,25],[50,50],[25,75],[75,75]],
          6:[[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]]
        };
        patterns[die].forEach(([x,y])=>add("circle",{
          cx:340+x,cy:75+y,r:5,fill:"#4338ca"}));
        label(390,200,`Dice: ${die}`,15,"#4338ca");
        label(390,222,"1 to 6",12,"#475569");
        message=`Coin: ${heads?"Heads":"Tails"}. Dice outcome: ${die}.`;

      } else if (kind === "sequence") {
        const count=n+1;
        label(300,25,"Even-number sequence",17,"#4338ca");
        for(let i=1;i<=count;i++) {
          const h=i*12, x=35+(i-1)*50;
          add("rect",{x,y:205-h,width:34,height:h,rx:4,
            fill:i===count?"#f59e0b":"#818cf8"});
          label(x+17,220,String(i*2),12,"#334155");
          label(x+17,Math.max(55,205-h-7),String(i),10,"#475569");
        }
        label(300,250,`Term ${count} = ${2*count}`,15,"#4338ca");
        message=`Step ${count}: term = ${2*count}.`;
      }

      output.textContent=message;
    }

    slider.addEventListener("input",draw);
    play.addEventListener("click",()=>{
      if(timer) {
        clearInterval(timer); timer=null;
        play.textContent="▶ Play";
      } else {
        play.textContent="⏸ Pause";
        timer=setInterval(()=>{
          slider.value=Number(slider.value)>=10?0:Number(slider.value)+1;
          draw();
        },900);
      }
    });
    reset.addEventListener("click",()=>{
      if(timer) clearInterval(timer);
      timer=null; play.textContent="▶ Play";
      slider.value=5; draw();
    });
    draw();
  });
})();
