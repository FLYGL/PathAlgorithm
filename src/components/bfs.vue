<template>
  <div>
    <div class="space"></div>
    <div class="container" :style="{height:height+'px',width:width+'px'}">
      <div  v-for="(x,number) in row" :key="number" :style="{height: '50px',width:width+'px'}">
        <div  :id="number*col+index" class="block" @mouseover="Occu" @mousedown="ChangeMode"
              @mouseenter="ChangeBlock" @mouseup="restoreMode"  v-for="(item,index) in col" :key="index"
              :style="{left:index*50+'px',top:number*50+'px'}" onSelectStart="return false" ></div>
      </div>
    </div>
    <div>
      <input type="button" class="btn btn-warning" value="BFS" @click="BFS">
      <input type="button" class="btn btn-warning" value="AStar" @click="AStar">
      <input type="button" class="btn btn-warning" value="Init" @click="MapInit">
      <input type="button" class="btn btn-warning" value="AStarWebWorker" @click="AStarWebWorker">
    </div>
  </div>

</template>

<script>

  export default {
    name: 'bfs',
    data(){
      return {
        row: 25,
        col: 60,
        src:{
          X:0,
          Y:0,
          //增加一个last指针
          ParentId:0
        },
        des:{
          X:10,
          Y:0,
          Id:10,
          ParentId:10
        },
        mouse_down:false,
        moveMode:100,     //1为移动终点  2为移动起始点  3涂白色  4 涂灰色
        lastId:0,//用来终点和起始点移动记录
        occlusion:false,//是否阻塞block
        open:[],
        closed:[],
        timer:0,//定时器
        Alltimer:[],//保存所有定时器
        //AStar参数
        begin:{
          X:0,
          Y:0,
          Id:0,
          H:Number,
          G:Number,
          F:Number,
          ParentId:0
        },
        end:{
          X:10,
          Y:0,
          Id:10,
          H:Number,
          G:Number,
          F:Number,
          ParentId:10
        },
        //优化 将dom缓存下来
        blocks:[],
        //colorblock顺序
        colorqueue:[],
        //障碍数组
        WallId:[],
        worker:null,//用于 vue-worker
      }
    },
    computed:{
      width(){
        return this.col*50
      },
      height(){
        return this.row*50
      },
    },
    mounted(){
      this.MapInit();
      var timers=[];
      var blocks=[];
      this.worker=new Worker('../../static/AStar.js');
      this.worker.onmessage=function (e) {
        //解决所有dom操作
        //解决连续点击问题
        //blocks=document.getElementsByClassName('block')
        for(let i=0;i<timers.length;i++){
          clearTimeout(timers[i]);
        }
        for(let i=0;i<blocks.length;i++){
          document.getElementById(blocks[i]).style.background='';
        }
        blocks=[];
        //开始画图
        var colorqueue = e.data;
        var curblock = new Object;
        var timer = 0;
        while (colorqueue.length != 0) {
          curblock = colorqueue.shift();
          let id = curblock.id;
          blocks.push(id);
          let color = curblock.color;
          let aTimer = setTimeout(() => {
              document.getElementById(id).style.background = color;
            }
            , timer * 5)
          timers.push(aTimer);
          timer++;
        }
      }
    },
    methods:{
      ChangeBlock(e){
        if(this.occlusion)return;
        if(this.mouse_down)
        {
          //对于终点和起始点差别处理
          switch(this.moveMode){
            case 1:{
              this.GetDomBlock(this.lastId).classList.remove('des')
              e.currentTarget.classList.add('des')
              this.lastId=e.currentTarget.id;
            }break;
            case 2:{
              this.GetDomBlock(this.lastId).classList.remove('src')
              e.currentTarget.classList.add('src')
              this.lastId=e.currentTarget.id;
            }break;
            case 3:{
              e.currentTarget.classList.remove('anima_gray');
              e.currentTarget.classList.add('anima_white');
            }break;
            case 4:{
              e.currentTarget.style.background=''
              e.currentTarget.classList.remove('anima_white');
              e.currentTarget.classList.add('anima_gray');
            }break;
          }
        }

      },
      ChangeMode(e){
        this.mouse_down=true;
        if(this.ComputeId(this.des)==e.currentTarget.id){
          this.moveMode=1;
          this.lastId=this.ComputeId(this.des);
        }
        else if(this.ComputeId(this.src)==e.currentTarget.id){
          this.moveMode=2;
          this.lastId=this.ComputeId(this.src);
        }
        else if(e.currentTarget.classList.contains('anima_gray'))
        {
          this.moveMode=3;
          e.currentTarget.classList.remove('anima_gray');
          e.currentTarget.classList.add('anima_white');
        }
        else {
          this.moveMode=4;
          e.currentTarget.classList.remove('anima_white');
          e.currentTarget.classList.add('anima_gray');
        }
      },
      Occu(e){
        switch (this.moveMode) {
          case 1: {
            if (e.currentTarget.classList.contains('anima_gray') || this.ComputeId(this.src) == e.currentTarget.id) {
              this.occlusion = true;
              return;
            }
          }break;
          case 2: {
            if (e.currentTarget.classList.contains('anima_gray')  || this.ComputeId(this.des) == e.currentTarget.id) {
              this.occlusion = true;
              return;
            }
          }break;
          case 3: {
            if( this.ComputeId(this.src) == e.currentTarget.id|| this.ComputeId(this.des) == e.currentTarget.id){
              this.occlusion=true;
              return;
            }
          }break;
          case 4:{
            if( this.ComputeId(this.src) == e.currentTarget.id|| this.ComputeId(this.des) == e.currentTarget.id){
              this.occlusion=true;
              return;
            }
          }break;
        }
        this.occlusion=false;
      },
      restoreMode(e){
        this.mouse_down=false;
        //更行des
        if(this.moveMode==1){
          let desId=e.currentTarget.id;
          this.des.X=desId%this.col;
          this.des.Y=Math.floor(desId/this.col);
          this.des.ParentId=this.ComputeId(this.des);
          this.des.Id=desId;
          this.end.X=desId%this.col;
          this.end.Y=Math.floor(desId/this.col);
          this.end.ParentId=this.ComputeId(this.des);
          this.end.Id=desId;
        }
        else if(this.moveMode==2){
          let srcId=e.currentTarget.id;
          this.src.X=srcId%this.col;
          this.src.Y=Math.floor(srcId/this.col);
          this.src.ParentId=this.ComputeId(this.src);
          this.begin.X=srcId%this.col;
          this.begin.Y=Math.floor(srcId/this.col);
          this.begin.ParentId=this.ComputeId(this.src);
          this.begin.Id=srcId;
        }

        this.moveMode=100;
      },
      MapInit(){
        for(var aTimer of this.Alltimer){
          clearTimeout(aTimer);
        }
        this.blocks=document.getElementsByClassName('block')
        for(let block of this.blocks){
          block.classList=[];
          block.classList.add('block');
          block.style.background=''
          block.innerHTML=''
        }
        this.GetDomBlock(this.ComputeId(this.src)).classList.add('src');
        this.GetDomBlock(this.ComputeId(this.des)).classList.add('des');
        this.open=[];
        this.closed=[];
        this.mouse_down=false;
        this.lastId=0;
        this.occlusion=false;
        this.timer=0;
        this.moveMode=100;
      },
      ComputeId(positon=new Object){
        return positon.Y*this.col+parseInt(positon.X);
      },
      ComputeH(position=new Object){
        return Math.abs(position.X-this.des.X)+parseInt(Math.abs(position.Y-this.des.Y));
      },
      PushOrder(point=new Object){//有序排队
        point.H=this.ComputeH(point);        //计算估值，插值,变色
        if(this.GetDomBlock(this.ComputeId(point)).classList.contains('anima_gray'))return false;
        if(this.CheckSame(point,this.open)!=-1||this.CheckSame(point,this.closed)!=-1)
          {
            console.log('重复')
            return false;
          }
        if(this.open.length==0) {
          this.open.push(point);
          console.log('添加成功')
        }
        else{
          for(let i=0;i<this.open.length;i++){
            //这样处理别忘了 还有h最大情况 也要加入open表中，优先考虑最大h值，这样可以减少不必要循环
            if(point.H>=this.open[this.open.length-1].H){
              this.open.push(point);
              console.log('插入最后')
              break;
            }
            if(point.H<=this.open[i].H){
              this.open.splice(i,0,point)
              console.log('插入中间')
              break;
            }
          }
        }
        if(!(point.X==this.des.X&&point.Y==this.des.Y))
        {
          //创造一个副本
          let temp=point;
          let aTimer=setTimeout(()=>{
              this.GetDomBlock(this.ComputeId(temp)).style.background='rgb(152, 251, 152)';
          }
          ,this.timer*10)
          this.Alltimer.push(aTimer);
          this.timer++;
        }
      },
      RemoveBackgroundColor(){
        for(var aTimer of this.Alltimer){
          clearTimeout(aTimer);
        }
        for(let block of this.blocks){
          block.style.background=''
          //block.innerHTML=''
        }
        this.GetDomBlock(this.ComputeId(this.src)).classList.add('src');
        this.GetDomBlock(this.ComputeId(this.des)).classList.add('des');
        this.GetDomBlock(this.begin.Id).classList.add('src');
        this.GetDomBlock(this.end.Id).classList.add('des');
        this.open=[];
        this.closed=[];
        this.timer=0;
      },
      DrawPath(id){
        //再closed中找到id
        //对该对象处理
        //找上一个
        //直到id==src.id
        var temp=id;
        while(temp!=this.ComputeId(this.src)){
          //TODO 尝试用canvas来实现路径
          let tempid=temp;
          let aTimer=setTimeout(()=>{
              this.GetDomBlock(tempid).style.background='#ffa516';
            }
            ,this.timer*10)
          this.Alltimer.push(aTimer);
          this.timer++;
          temp=this.ReturnParentId(tempid);
        }
      },
      ReturnParentId(id){  //找到closed id对应的ParentId
        for(var point of this.closed){
          if(this.ComputeId(point)==id)return point.ParentId;
        }
        return -1;//失败情况
      },
      CheckSame(point,array){      //对象数组检验是否遍历过
        var id=this.ComputeId(point);
        for(var temp of array){
          if(id==this.ComputeId(temp))return array.indexOf(temp);
        }
        return -1;
      },
      BFS(){
        //重复BFS功能
        this.RemoveBackgroundColor();
        //将第一个点放入open
        this.open.push(this.src);
        var point=new Object;
        while(this.open.length!=0){
          point=this.open.shift();
          //判断是否到达目的
          if(point.X==this.des.X&&point.Y==this.des.Y){
            this.DrawPath(point.ParentId);
            console.log('查询成功');
            return true;
          }
          //计算h值并把子节点放入open表中
          if(point.X>0){
            //左移，放入open表按照插值排序从小到大
            let tempPoint={
              X:point.X-1,
              Y:point.Y,
              H:point.H,
              ParentId:this.ComputeId(point)
            }
            this.PushOrder(tempPoint);
          }
          if(point.X<this.col-1){
            //右移
            let tempPoint={
              X:point.X+1,
              Y:point.Y,
              H:point.H,
              ParentId:this.ComputeId(point)
            }
            this.PushOrder(tempPoint);
          }
          if(point.Y>0){
            //上移
            let tempPoint={
              X:point.X,
              Y:point.Y-1,
              H:point.H,
              ParentId:this.ComputeId(point)
            }
            this.PushOrder(tempPoint);
          }
          if(point.Y<this.row-1) {
            //下移
            let tempPoint={
              X:point.X,
              Y:point.Y+1,
              H:point.H,
              ParentId:this.ComputeId(point)
            }
            this.PushOrder(tempPoint);
          }
          this.closed.push(point);
          if(!(point.X==this.src.X&&point.Y==this.src.Y))
          {
            let temp=point;//同一副本问题，延迟后执行的point不是当时想要的point
            let aTimer=setTimeout(()=>{
                this.GetDomBlock(this.ComputeId(temp)).style.background='rgb(175, 238, 238)';
                //this.GetDomBlock(this.ComputeId(temp)).innerText=temp.H;
              }
              ,this.timer*10)
            this.Alltimer.push(aTimer);
            this.timer++;
          }

        }
        console.log('查找失败，未能找到目标');
        return false;
      },
      AStar(){
        //重复
        this.RemoveBackgroundColor();
        //初始
        this.begin.H=this.ComputeH(this.begin);
        this.begin.G=0;
        this.begin.F=this.begin.H+this.begin.G;
        this.open.push(this.begin);
        var point=new Object;
        while(this.open.length!=0){
          point=this.open.shift();
          if(point.Id==this.end.Id){
            break;
          }
          if(point.X>0){
            //左移，放入open表按照插值排序从小到大
            let tempPoint={
              X:point.X-1,
              Y:point.Y,
              G:point.G+1,
              ParentId:point.Id
            }
            this.PushOpen(tempPoint,this.StoreBlock);
          }
          if(point.X<this.col-1){
            //右移
            let tempPoint={
              X:point.X+1,
              Y:point.Y,
              G:point.G+1,
              ParentId:point.Id
            }
            this.PushOpen(tempPoint,this.StoreBlock);
          }
          if(point.Y>0){
            //上移
            let tempPoint={
              X:point.X,
              Y:point.Y-1,
              G:point.G+1,
              ParentId:point.Id
            }
            this.PushOpen(tempPoint,this.StoreBlock);
          }
          if(point.Y<this.row-1) {
            //下移
            let tempPoint={
              X:point.X,
              Y:point.Y+1,
              G:point.G+1,
              ParentId:point.Id
            }
            this.PushOpen(tempPoint,this.StoreBlock);
          }
          this.closed.push(point);
          this.StoreBlock(point,'rgb(175, 238, 238)');
        }
        if(point.Id==this.end.Id){
          //存储回归路径
          var temp=point.ParentId;
          while(temp!=this.ComputeId(this.src)){
            //TODO 尝试用canvas来实现路径
            //this.StoreBlock() 可以重载吗
            let tempid=temp;
            this.colorqueue.push({id:tempid,color:'#ffa516'});
            temp=this.ReturnParentId(tempid);
          }
          console.log('success');
        }
        else console.log('fail');
        console.log(this.colorqueue)
        this.ColoringBlock();
      },
      PushOpen(point=new Object,callback){
        point.Id=this.ComputeId(point);
        point.H=this.ComputeH(point);
        point.F=point.H+point.G;
        if(this.GetDomBlock(this.ComputeId(point)).classList.contains('anima_gray'))return false;
        var flag=this.CheckSame(point,this.open);
        if(flag!=-1){
          if(point.F<this.open[flag].F)this.open.splice(flag,1);
          else return false;
        }
        flag=this.CheckSame(point,this.closed);
        if(flag!=-1) {
          if(point.F<this.closed[flag].F)this.closed.splice(flag,1);
          else return false;
        }
        if(this.open.length==0)this.open.push(point);
        else {
          if(point.F>=this.open[this.open.length-1].F)this.open.push(point);
          for(let i=0;i<this.open.length;i++){
            if(point.F<=this.open[i].F){
              this.open.splice(i,0,point);
              break;
            }
          }
        }
        callback(point,'rgb(152, 251, 152)');
      },
      GetDomBlock(id){
        return this.blocks[id];
      },
      ColoringBlock(){
        var curblock=new Object;
        while(this.colorqueue!=0) {
          curblock=this.colorqueue.shift();
          let id=curblock.id;
          let color=curblock.color;
          let aTimer=setTimeout(()=>{
              this.GetDomBlock(id).style.background=color;
            }
            ,this.timer*10)
          this.Alltimer.push(aTimer);
          this.timer++;
        }
      },
      StoreBlock(point,color){
        //color=1为rgb(152, 251, 152)  color=2为rgb(175, 238, 238)
          this.colorqueue.push({id:point.Id,color:color});
      },
      CaculateWall(){
        this.WallId=[];
        var walls= document.getElementsByClassName('anima_gray');
        for(let wall of walls){
          this.WallId.push(wall.id);
        }
      },
      AStarWebWorker(){
        this.CaculateWall();
        var json={
          src:this.src,
          des:this.des,
          row:this.row,
          col:this.col,
          wallId:this.WallId,
        }
        this.worker.postMessage(json);
      },
      //下面时测试对照用的
      StarA (src,des,row,col,wallId) {
        function computeId (positon=new Object) {
          return positon.Y*col+parseInt(positon.X);
        }
        function checkSame (point,array) {
          var id=computeId(point);
          for(let i=0;i<array.length;i++){
            if(id==computeId(array[i]))return i;
          }
          return -1;
        }
        function storeBlock (point,color) {
          Colorqueue.push({id:point.Id,color:color});
        }
        function computeH (position) {
          return Math.abs(position.X-des.X)+parseInt(Math.abs(position.Y-des.Y));
        }
        function pushOpen (point) {
          point.Id=computeId(point);
          point.H=computeH(point);
          point.F=point.H+point.G;
          if(wallId.includes(computeId(point)))return false;
          var flag=checkSame(point,open);
          if(flag!=-1){
            if(point.F<open[flag].F)open.splice(flag,1);
            else return false;
          }
          flag=checkSame(point,closed);
          if(flag!=-1) {
            if(point.F<closed[flag].F)closed.splice(flag,1);
            else return false;
          }
          if(open.length==0)open.push(point);
          else {
            if(point.F>=open[open.length-1].F)open.push(point);
            for(let i=0;i<open.length;i++){
              if(point.F<=open[i].F){
                open.splice(i,0,point);
                break;
              }
            }
          }
          storeBlock(point,'rgb(152, 251, 152)');
        }
        function returnParentId (id) {
          console.log('oh')
          for(var point of closed){
            if(computeId(point)==id)return point.ParentId;
          }
          return -1;//失败情况
        }
        //开始
        var open=[];
        var closed=[];
        var Colorqueue=[];
        src.Id=computeId(src);
        src.H=computeH(src);
        src.G=0;
        src.F=src.H+src.G;
        open.push(src);
        var point=new Object;
        while(open.length!=0){
          point=open.shift();
          if(point.Id==des.Id){
            break;
          }
          if(point.X>0){
            //左移，放入open表按照插值排序从小到大
            let tempPoint={
              X:point.X-1,
              Y:point.Y,
              G:point.G+1,
              ParentId:point.Id
            }
            pushOpen(tempPoint);
          }
          if(point.X<col-1){
            //右移
            let tempPoint={
              X:point.X+1,
              Y:point.Y,
              G:point.G+1,
              ParentId:point.Id
            }
            pushOpen(tempPoint);
          }
          if(point.Y>0){
            //上移
            let tempPoint={
              X:point.X,
              Y:point.Y-1,
              G:point.G+1,
              ParentId:point.Id
            }
            pushOpen(tempPoint);
          }
          if(point.Y<row-1) {
            //下移
            let tempPoint={
              X:point.X,
              Y:point.Y+1,
              G:point.G+1,
              ParentId:point.Id
            }
            pushOpen(tempPoint);
          }
          closed.push(point);
          storeBlock(point,'rgb(175, 238, 238)');
        }
        if(point.Id==des.Id){
          var temp=point.ParentId;
          while(temp!=computeId(src)){
            let tempid=temp;
            Colorqueue.push({id:tempid,color:'#ffa516'});
            temp=returnParentId(tempid);
          }
          console.log('success');
        }
        else console.log('fail');
        console.log('open'+open);
        console.log('closed'+closed.length)
        console.log('Colorqueue '+Colorqueue.length)
        return Colorqueue;
      }
    }
  }
</script>

<style scoped>
  .container{
    position: relative;
    margin:0 0 0 0;
    padding: 0;
  }
.block{
  top:100px;
  width:50px;
  height:50px;
  margin: 0px 0px 0px 0px;
  border:0.5px solid #000000;
  display: inline-block;
  position: absolute;
  transition: background 0.1s;
}
.space{
  top:1000px;
}
.des{
  background: rgb(238, 0, 23) !important;
}
.src{
  background:rgb(0, 221, 0)   !important;

}
.anima_gray{
  background: #808080;
  animation: Togray 0.3s forwards;
}
.anima_white{
  animation: Tograys 0.3s forwards;
  background: white;
}
@keyframes Togray {
  0%{
    transform: matrix(1.2,0,0,1.2,0,0);
    z-index: 10;
  }
  100%{
    transform:matrix(1,0,0,1,0,0);
    z-index: 0;
  }
}
@keyframes Tograys {
  0% {
    transform: scale(1.2, 1.2);
    z-index: 10;
  }
  100% {
    transform: scale(1, 1);
    z-index: 0;
  }
}
</style>

