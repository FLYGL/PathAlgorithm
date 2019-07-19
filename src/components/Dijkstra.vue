<template>
  <div>
    <div class="space"></div>
    <div class="container" :style="{height:heights+'px',width:widths+'px'}">
      <div  v-for="(row,number) in row_num" :key="number" :style="{height: '50px',width:widths+'px'}">
        <div  :id="number*col_num+index" class="block" v-for="(item,index) in col_num" :key="index" :style="{left:index*50+'px',top:number*50+'px'}"></div>
      </div>
    </div>
    <div>
      <div>
        <label>height</label>
        <input type="text" v-model="heights" class="input">
      </div>
      <div>
        <label>width</label>
        <input type="text" v-model="widths" class="input">
      </div>
      <div>
        <label>src横坐标</label>
        <input type="text" v-model="srcX" class="input">
      </div>
      <div>
        <label>src纵坐标</label>
        <input type="text" v-model="srcY" class="input">
      </div>
      <div>
        <label>dest横坐标</label>
        <input type="text" v-model="destX" class="input">
      </div>
      <div>
        <label>dest纵坐标</label>
        <input type="text" v-model="destY" class="input">
      </div>
      <div>
        <input type="button" class="btn btn-warning"  value="Start" @click="Dijstra(srcId,desId)">
        <input type="button" class="btn btn-warning"  value="Init" @click="Coloring()">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Dijkstra',
    data(){
      return {
        widths:500,
        heights:500,
        colors:['red','blue','green'],//red 0  blue 1  green 2
        dist:[],//用于存储距离 100个点
        points:[],//待松弛id，要从待松弛点集中找到最小距离对应id
        path:[],//存储路径
        k:0,//延时变化
        srcX:0,
        srcY:0,
        destX:0,
        destY:0,
      }
    },
    computed:{
      row_num(){
        return parseInt(this.heights/50);
      },
      col_num(){
        return parseInt(this.widths/50);
      },
      srcId(){
        let temp=(this.srcX-1)*this.col_num+parseInt(this.srcY)-1
        return temp
      },
      desId(){
        let temp=(this.destX-1)*this.col_num+parseInt(this.destY)-1
        return temp
      }
    },
    mounted () {
      this.Coloring();
    },
    methods:{
      Coloring(){
        for(let i=0;i<this.row_num*this.col_num;i++){
          document.getElementById(i).style.background=this.colors[Math.floor(Math.random()*3)];
        }
        this.dist=[];
        this.path=[];
        this.points=[];
        this.k=0;
        for(let i=0;i<this.col_num*this.row_num;i++){
          this.dist[i]=Infinity;
          this.points.push(i);
          this.path.push(-1);
        }
      },
      ComDist(src,dest){
        if(Math.abs(src-dest)==this.col_num||Math.abs(src-dest)==1)
        {return this.colors.indexOf(document.getElementById(src).style.background)+this.colors.indexOf(document.getElementById(dest).style.background);}
        else{
          return Infinity;
        }
      },
      ComPosi(id){
        //通过id算出坐标
        return{
          row:Math.floor(id/10)+1,
          col:id%10+1
        }
      },
      Dijstra(src,dest){
          let curId;
          this.dist[src]=0;
          while(this.points.length!=0) {
            console.log(1)
            curId = this.Select();
            this.Remove(curId);
            // 广度遍历，计算路径并刷新数组，寻找最小路径（在points中的），再广度遍历
            //寻找下一个节点
              //向上移动
            if(curId>=this.col_num) {
                if(this.dist[curId - this.col_num]>this.dist[curId] + this.ComDist(curId, curId - this.col_num))this.path[curId-this.col_num]=curId;
                this.dist[curId - this.col_num] = Math.min(this.dist[curId - this.col_num], this.dist[curId] + this.ComDist(curId, curId - this.col_num));//console.log('向上移动'+(curId - this.col_num))
              }
              //向下移动
            if(curId<this.col_num*(this.row_num-1)){
              if(this.dist[curId + this.col_num]>this.dist[curId] + this.ComDist(curId, curId + this.col_num))this.path[curId+this.col_num]=curId;
              this.dist[curId + this.col_num] = Math.min(this.dist[curId + this.col_num], this.dist[curId] + this.ComDist(curId, curId + this.col_num));//console.log('向下移动'+(curId + this.col_num))
            }
              //向左移动
            if(curId%this.col_num!=0){
              if(this.dist[curId - 1]>this.dist[curId] + this.ComDist(curId, curId - 1))this.path[curId-1]=curId;
              this.dist[curId - 1] = Math.min(this.dist[curId - 1], this.dist[curId] + this.ComDist(curId, curId - 1));//console.log('想左移动'+(curId - 1))
            }
              //向右移动
            if(curId%this.col_num!=this.col_num-1){
              if(this.dist[curId +1]>this.dist[curId] + this.ComDist(curId, curId +1))this.path[curId+1]=curId;
              this.dist[curId + 1] = Math.min(this.dist[curId + 1], this.dist[curId] + this.ComDist(curId, curId + 1));//console.log('向右移动'+(curId + 1))
            }//console.log(this.dist)
          }
          console.log(2)
          this.DisplayShortest(dest);
          document.getElementById(src).style.background='black';
          document.getElementById(src).style.transitionDelay=this.k*50+'ms';
      },
      Remove(id){
        //删除指定元素
        this.points.splice(this.points.indexOf(id),1);
      },
      Select(){
        //未排序只是选出最小值id
        var id=this.points[0];
        for(var i=0;i<this.points.length;i++) {
          if(this.dist[id]>this.dist[this.points[i]]){
              id=this.points[i];
          }
        }
        return id;
      },
      DisplayShortest(dest){
        let temp=dest;
        this.k=0;
        console.log(dest)
        while(this.path[temp]!=-1){
          document.getElementById(temp).style.background='black';
          document.getElementById(temp).style.transitionDelay=this.k*50+'ms';
          this.k++;
          temp=this.path[temp];
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    background: white;
    margin:0 0 0 0;
    padding: 0;

  }
  .block{
    width:48px;
    height:48px;
    margin: 1px 1px 1px 1px;
    border:2px solid red;
    background: coral;
    display: inline-block;
    z-index: 0;
    transition: background 2s;
  }
  .input{
    border: 1px solid #ccc;
    padding: 7px 0px;
    border-radius: 3px;
    padding-left:5px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
  }
  .input:focus{
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
  }
  .space{
    height: 100px;
  }
</style>
