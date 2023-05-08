import { createRouter, createWebHistory } from 'vue-router'
import ProductDetails from './components/ProductDetails.vue'
import Products from './components/ProductList.vue'
import Signup from './components/SignUp.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Products },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/product/:id', component: ProductDetails, name: 'product', props: true }
  ]
})

export default router

