import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import breadthFirst from '@/components/breadth_first'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      children: [
        {
          path: '/breadthFirst',
          name: 'breadthFirst',
          component: breadthFirst
        },
        {
          path: '/dijkstra',
          name: 'dijkstra',
          component: () => import('@/components/Dijkstra.vue')
        },
        {
          path: '/bfs',
          name: 'bfs',
          component: () => import('@/components/bfs.vue')
        },
        {
          path: '/canvas',
          name: 'canvas',
          component: () => import('@/components/Canvas.vue')
        }
      ]
    }
  ]
})
