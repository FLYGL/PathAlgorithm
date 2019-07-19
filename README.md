### education
> A Vue.js project
### Build Setup
``` bash
# install dependencies
npm install
# serve with hot reload at localhost:8080
npm run dev
# build for production with minification
npm run build
# build for production and view the bundle analyzer report
npm run build --report
```
### 注意js的拷贝
JSON.parse(JSON.stringify(node))
### vue问题
在methods中的函数用在外面还是有点不一样，至少this指代不一样
### dijstra算法
1.选取初始点和多终点:暂时用 10*10 对角寻找最短路径，从（1，1）到（10，10）
2.实施dijstra算法
  1.breadth 找到距离
  2.存储位置，是否有多条路径
  3.画图
3.画出路径
4.路径赋值问题，采用三种颜色 即1，2，3种情况
5.广度遍历中寻找最短路径从中继续广度遍历
### best-first-search
1 估值函数 是曼哈顿距离
2. select的优先级改为 估值最小的情况
3. open表和close表
单位距离为1，有阻碍形式,这个最后再加

表现形式：曼哈顿距离，open中的绿色标明（将要扩展的子节点），close表中以便过的节点  浅蓝色标明已经走过的

绿色开始节点  红色终点


相同 animation反复赋值会出现特效不现实（不清楚底层）
点击两个div中间 仲裁问题,这个并不是点击中间，而是鼠标默认拖拽网页元素的行为 采用 onSelectStart= "return false"js句柄就行

被改过颜色的块会覆盖周围块特效      选用z-index 但是注意可能会失效，注意position:absolutely


颜色显示问题，是因为程序计算太快，绿色还没有显示就被更新为蓝色了,决定使用setTimeout来实现延迟（但是这个函数表现像异步，但并不是真的异步，有队列存在）
question: 同时settimeout 但是再一边 point不是动态变化的，临时创造一个副本来解决问题


关于对象数组 查找有没有对象存在问题的解决,本来是可以JSON.stringify(this.closed).indexOf(JSON.stringify(point))!=-1，但是数据结构改变后需要专门编写函数
函数顺序 先mouseleave mouseover mouseenter 

3种颜色的块不相容：
暂时决定用class样式决定，这也可以省去lastcolor变量
由于函数执行顺序，是很难实现，所以改成不适用mouseleave


同时样式和style.background是不一样的

初始化问题也解决了

last question:返回推荐路径怎么解决：目前是想通过构建树来回退出路径
增添一个lastid来记录所有block只需要记住自己的parent就行了  √

画线来表示路径,这个A*算法完了再说 尝试用TODO
### A*算法

AStar算法是 BFS Dijkstra的结合
既需要一直求当前最小的距离，也需要靠优先级选取合适的点来扩展

特点：
Dijkstra:一个已确定集合，一个待遍历集合，通过path找到路径
BFS： 一个open表来选取适合节点，一个 closed可以用来找到路径

初步变量或数据结构：
对于每个节点：
{
  X:
  Y:
  Id:
  H:
  G:
  F:
}
虽然有重复赘余，但是会减少计算量，同时该数据结构还没有考虑关于 路径问题：ParentId 或 Path数组

这里G只是简单+1操作
AStar遍历的较多
还可以精简代码
### bigproblem已经解决
当地图复杂时，效率优化:个人猜测需要回调函数来优化，验证当对象传入函数时，函数内部改变是否会改变外部的对象
1.webWorkers 只能尝试webWorkers了  发现有vue-worker 尝试看vue-worekr可不可以满足需求                 success√
  返回参数：closed表和colorqueue队列
  传入：参数 open表，close表（本质时把情况地图情况发出来）
  根据close colorqueue作图
   
  问题：
    现在担心 worker(create方式)中函数可不可以互相调用：test走起
    
          const actions=[
            {
              message:'x',
              func:function Caculate(a) {
                function B() {
                  return 4;
                }
                return B()+a;
              }
            },
            {
              message:'y',
              func:function B() {
                return 4;
              }
            }
          ]
          var worker=this.$worker.create(actions);
          worker.postMessage('x',[1]).then(function (res) {
            console.log(res);
          })
   不行，so 建议全写在一个大函数，这样就行（有点难看）
   now想一想除了要作画 我的算法需要有关网页的什么因素，so  实际我只想知道 起始点 终结点 以及 障碍的位置我就可以单独运算了
   障碍位置传参需要考率：我的算法基于 x y  row col所以so easy 
   注意vue-worker新线程没有依赖 回调中也是 我觉的vue-worker失败还是有巨大的原因，其实只要直接写在回调里就行了 vue-worker不失败，但是我用webworker success
   Failed to execute 'postMessage' on 'Worker': function () { [native code] } could not be cloned. 应为
   data{
      a:Number,
    }
2.回调实现效果不佳 defeat
3.集中dom操作  defeat    
### 新问题
算法没有统一格式化
### UI制作

1.浮动框
### js
  var a=[1,2];
  var b=[3,4];
  function change (x,y) {
    x.push('a');
    y.push('b');
  }
  change(a,b);
  console.log(a)
  console.log(b)
  证明时引用关系
### canvas
canvas动画特效实现基于理念：
1.物理世界的规则：加速度，速度，位移，这些值经过快速重复运算，就是动态的了，但是要注意3个值变化的先后顺序
2.动画之所以动还是高速重绘，这时根本之源，与自己做得算法动画还不太一样，至少从API来看，至少canvas更基础
3.canvas对于vue 画面缩放， viewport， vw vh理解
### vw、vh、viewport
待解决
