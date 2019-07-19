function StarA(src,des,row,col,wallId) {
  var open=[];
  var closed=[];
  var Colorqueue=[];
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
    if(wallId.includes(computeId(point)+'')){
      return ;
    }
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
    for(let i=0;i<closed.length;i++){
      if(computeId(closed[i])==id)return closed[i].ParentId;
    }
    return -1;//失败情况
  }
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
  return Colorqueue;
}
self.addEventListener('message',function (e) {
  postMessage(StarA(e.data.src,e.data.des,e.data.row,e.data.col,e.data.wallId))
})
