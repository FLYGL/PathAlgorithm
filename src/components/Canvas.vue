<template>
  <div class="wrapper">
    <canvas id="scene" @mousemove="ChangeMouse" @click="ChangeRadius" @resize="initScene"></canvas>
    <input id="copy" type="text" value="Hello Canvas" v-model="value" @keyup="initScene"/>
  </div>
</template>

<script>
  export default {
    name: 'Canvas',
    data(){
      return {
        ww:0,
        wh:0,
        canvas:undefined,
        ctx:undefined,
        colors:["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"],
        mouse:{
          x:0,
          y:0
        },
        particles:[],
        amount:0,
        radius:1,
        value:'Hello World',
        k:0,
      }
    },
    mounted () {
      //this.ctx=this.canvas.getContext('2d');
      this.canvas=document.getElementsByTagName('canvas')[0];
      this.ctx=document.getElementsByTagName('canvas')[0].getContext("2d");
      this.ww = this.canvas.width
      this.wh = this.canvas.height
      this.initScene();
      this.AllRender();
    },
    methods:{
      Particle(x,y){
        var particleJson={
          x :  Math.random()*this.ww,
          y :  Math.random()*this.wh,
          dest : {
          x : x,
          y : y
          },
          r : Math.random()*5 + 2,               //随机半径（颗粒大小）
          vx : (Math.random()-0.5)*20,
          vy : (Math.random()-0.5)*20,
          accX : 0,
          accY : 0,
          friction : Math.random()*0.05 + 0.94,        //随机摩擦力（缓冲的动画效果）
          color : this.colors[Math.floor(Math.random()*6)],   //随机颜色
        }
        return particleJson;
      },
      SingleRender(particle){
        particle.accX = (particle.dest.x - particle.x)/1000;
        particle.accY = (particle.dest.y - particle.y)/1000;
        particle.vx += particle.accX;
        particle.vy += particle.accY;
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;

        particle.x += particle.vx;
        particle.y +=  particle.vy;

        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.r, Math.PI * 2, false);
        this.ctx.fill();

        var a = particle.x - this.mouse.x;
        var b = particle.y - this.mouse.y;

        var distance = Math.sqrt( a*a + b*b );
        if(distance<(this.radius*70)){
          particle.accX = (particle.x - this.mouse.x)/100;
          particle.accY = (particle.y - this.mouse.y)/100;
          particle.vx += particle.accX;
          particle.vy += particle.accY;
        }
        return particle
      },
      ChangeMouse(e){
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      },
      initScene(){
        this.ww = this.canvas.width=window.innerWidth
        this.wh = this.canvas.height=window.innerHeight

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);   //清空 Canvas

        this.ctx.font = "bold "+(this.ww/10)+"px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.value, this.ww/2, this.wh/2);               //将 Input 中输入的值，打印在 Canvas 上
        var data  = this.ctx.getImageData(0, 0, this.ww, this.wh).data;    //获取图像数据
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);   //清空 Canvas
        this.ctx.globalCompositeOperation = "screen";

        this.particles = [];
        for(var i=0;i<this.ww;i+=Math.round(this.ww/500)){
          for(var j=0;j<this.wh;j+=Math.round(this.ww/150)){
            if(data[ ((i + j*this.ww)*4) + 3] > 150){
              this.particles.push(this.Particle(i,j));      //将图像数据经过 Particle 函数处理后 push 到 particles 数组中
            }
          }
        }
        this.amount = this.particles.length;                          //获得 particles 的长度
      },
      ChangeRadius(){
        this.radius++;
        if(this.radius === 5){
          this.radius = 0;
        }
      },
      AllRender() {
        requestAnimationFrame(this.AllRender);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);   //清空 Canvas
        for (var i = 0; i < this.amount; i++) {
         this. particles[i]=this.SingleRender(this.particles[i]);                          //循环 particles 数组渲染
        }
      },
    },
  }
</script>

<style scoped>
  .wrapper{
    margin:0;
    overflow: hidden;
    font-size:0;
  }
  canvas{
    background: black;
    width: 100vw;
    height: 100vh;
  }
  input{
    width: 250px;
    height: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 35px;
    left: calc(50% - 125px);
    background: none;
    color: white;
    font-size: 30px;
    font-family: arial;
    text-align: center;
    border: 1px solid white;
    background: rgba(255,255,255,0.2);
  }
</style>
