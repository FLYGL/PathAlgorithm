<template>
  <div>
    <div class="space"></div>
    <div class="container" :style="{height:heights+'px',width:widths+'px'}">
      <div  v-for="(row,number) in row_num" :key="number" :style="{height: '50px',width:widths+'px'}">
        <div  :id="number*col_num+index" class="block" v-for="(item,index) in col_num" :key="index" :style="{left:index*50+'px',top:number*50+'px'}"></div>
      </div>
    </div>
    <div class="begin">
      <div>
        <input type="button" @click="Search({row:row_num/2,col:col_num/2})" class=" btn btn-warning" value="StartBFS">
        <input type="button" @click="BFSrecursive({row:row_num/2,col:col_num/2})" class=" btn btn-warning" value="BFSRecursive">
        <input type="button" @click="ChangeMode()" class=" btn btn-warning" value="Restore">
      </div>
      <div>
        <label>height</label>
        <input type="text" v-model="heights" class="input">
      </div>
      <div>
        <label>width</label>
        <input type="text" v-model="widths" class="input">
      </div>
    </div>
  </div>

</template>

<script>
  export  default {
      data(){
        return {
          widths:800,
          heights:500,
          queue:[],
          scene:[],
          color:'white',
          i:0
        }
      },
      name: 'breadth_first',
      methods:{
        Search:function( point={row, col}){
          //var scene=[];
          //console.log(point.row+' '+point.col);
          document.getElementById((point.row-1)*this.col_num+point.col-1).style.background=this.color;
          document.getElementById((point.row-1)*this.col_num+point.col-1).style.transitionDelay=this.i*1+"ms";
          this.i++;
         // this.sc
          //寻找下一个节点
          if(point.row==1&&point.col==1) {
            if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
              this.queue.push({row:point.row+1,col:point.col});
              this.scene.push((point.row)*this.col_num+point.col-1);
            }//下
            if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
              this.queue.push({row:point.row,col:point.col+1});
              this.scene.push((point.row-1)*this.col_num+point.col);
            }//右
          }
          else if(point.row==1&&point.col==this.col_num){
            if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
              this.queue.push({row:point.row+1,col:point.col});
              this.scene.push((point.row)*this.col_num+point.col-1);
            }//下
            if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
              this.scene.push((point.row-1)*this.col_num+point.col-2);
            }//左
          }
          else if(point.row==this.row_num&&point.col==this.col_num){
            if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
              this.scene.push((point.row-1)*this.col_num+point.col-2);
            }//左
            if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
              this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
          }
          else if(point.row==this.row_num&&point.col==1){
            if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
              this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
            if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
              this.queue.push({row:point.row,col:point.col+1});
              this.scene.push((point.row-1)*this.col_num+point.col);
            }//右
          }
          else if(point.row==1||point.row==this.row_num){
            if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
              this.queue.push({row:point.row,col:point.col+1});
              this.scene.push((point.row-1)*this.col_num+point.col);
            }//右
            if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
              this.scene.push((point.row-1)*this.col_num+point.col-2);
            }//左
          }
          else if(point.col==1||point.col==this.col_num){
            if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
              this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
            if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
              this.queue.push({row:point.row+1,col:point.col});
              this.scene.push((point.row)*this.col_num+point.col-1);
            }//下
          }
          else if(point.row<this.row_num&&point.row>1&&point.col<this.col_num&&point.col>1){
            if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
              this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
            if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
              this.queue.push({row:point.row+1,col:point.col});
              this.scene.push((point.row)*this.col_num+point.col-1);
            }//下
            if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
              this.queue.push({row:point.row,col:point.col+1});
              this.scene.push((point.row-1)*this.col_num+point.col);
            }//右
            if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
              this.scene.push((point.row-1)*this.col_num+point.col-2);
            }//左
          }

          //console.log(this.queue.length);
          //结束条件
          if(this.queue.length==0)return;
          this.Search(this.queue.shift());
        },
        ChangeMode(){
          this.scene=[];
          this.i=0;
          this.queue=[]
          if(this.color=='white'){
            this.color='black';
          }else if(this.color=='black'){
            this.color='white';
          }
        },
        BFSrecursive(point={row, col}){
          this.queue.push({row:point.row,col:point.col});
          this.scene.push((point.row-1)*this.col_num+point.col-1)
          while(this.queue.length!=0){
            point=this.queue.shift();
            console.log(this.ComId(point)+' '+((point.row-1)*this.col_num+point.col-1))
            document.getElementById((point.row-1)*this.col_num+point.col-1).style.background=this.color;
            document.getElementById((point.row-1)*this.col_num+point.col-1).style.transitionDelay=this.i*100+"ms";
            this.i++;
            if(point.row==1&&point.col==1) {
              if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
                this.queue.push({row:point.row+1,col:point.col});
                this.scene.push((point.row)*this.col_num+point.col-1);
              }//下
              if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
                this.queue.push({row:point.row,col:point.col+1});
                this.scene.push((point.row-1)*this.col_num+point.col);
              }//右
            }
            else if(point.row==1&&point.col==this.col_num){
              if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
                this.queue.push({row:point.row+1,col:point.col});
                this.scene.push((point.row)*this.col_num+point.col-1);
              }//下
              if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
                this.scene.push((point.row-1)*this.col_num+point.col-2);
              }//左
            }
            else if(point.row==this.row_num&&point.col==this.col_num){
              if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
                this.scene.push((point.row-1)*this.col_num+point.col-2);
              }//左
              if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
                this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
            }
            else if(point.row==this.row_num&&point.col==1){
              if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
                this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
              if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
                this.queue.push({row:point.row,col:point.col+1});
                this.scene.push((point.row-1)*this.col_num+point.col);
              }//右
            }
            else if(point.row==1||point.row==this.row_num){
              if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
                this.queue.push({row:point.row,col:point.col+1});
                this.scene.push((point.row-1)*this.col_num+point.col);
              }//右
              if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)){this.queue.push({row:point.row,col:point.col-1});
                this.scene.push((point.row-1)*this.col_num+point.col-2);
              }//左
            }
            else if(point.col==1||point.col==this.col_num){
              if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){this.queue.push({row:point.row-1,col:point.col});
                this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
              if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
                this.queue.push({row:point.row+1,col:point.col});
                this.scene.push((point.row)*this.col_num+point.col-1);
              }//下
            }
            else if(point.row<this.row_num&&point.row>1&&point.col<this.col_num&&point.col>1){
              if(!this.scene.includes((point.row-2)*this.col_num+point.col-1)){
                this.queue.push({row:point.row-1,col:point.col});
                this.scene.push((point.row-2)*this.col_num+point.col-1);}//上
              if(!this.scene.includes((point.row)*this.col_num+point.col-1)){
                this.queue.push({row:point.row+1,col:point.col});
                this.scene.push((point.row)*this.col_num+point.col-1);
              }//下
              if(!this.scene.includes((point.row-1)*this.col_num+point.col)){
                this.queue.push({row:point.row,col:point.col+1});
                this.scene.push((point.row-1)*this.col_num+point.col);
              }//右
              if(!this.scene.includes((point.row-1)*this.col_num+point.col-2)) {
                this.queue.push({row:point.row,col:point.col-1});
                this.scene.push((point.row-1)*this.col_num+point.col-2);
              }//左
            }
          }
        },
        ComId(point={row,col}){
          return (point.row-1)*this.col_num+point.col-1
        }
      },
      computed:{
        row_num(){
          return parseInt(this.heights/50);
        },
        col_num(){
          return parseInt(this.widths/50);
        }
      },
      mounted () {
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
    transition: background 0s;
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
