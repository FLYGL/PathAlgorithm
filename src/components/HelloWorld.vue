<template>
  <div>
    <div>
      <router-link to="/breadthFirst" replace><button class="btn btn-primary" >BreadthFirstSearch</button></router-link>
      <router-link to="/dijkstra" replace><button class="btn btn-primary">Dijkstra</button></router-link>
      <router-link to="/bfs" replace><button class="btn btn-primary">BestFirstSearch</button></router-link>
      <router-link to="/canvas" replace><button class="btn btn-primary">Canvas</button></router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {

}
</script>
<style>

</style>

