import Layout from '@/pages/layouts/index.vue';

export default [
  {
    path: '/main',
    component: Layout,
    redirect: '/main/index',
    name: 'main',
    meta: { title: '首页' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/pages/main/index.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/pages/main/coupon.vue'),
        meta: { title: '首页' },
      }
    ],
  },
  {
    path: '/search',
    component: Layout,
    name: 'search',
    redirect: '/search/index',
    meta: { title: '课程搜索' },
    children: [
      {
        path: 'index',
        name: 'search',
        component: () => import('@/pages/classSearch/index.vue'),
        meta: { title: '课程搜索' },
      }
    ],
  },
  {
    path: '/askDetails',
    component: Layout,
    name: 'askDetails',
    redirect: '/askDetails/index',
    meta: { title: '问题回复详情' },
    children: [
      {
        path: 'index',
        name: 'askDetails',
        component: () => import('@/pages/ask/askDetails.vue'),
        meta: { title: '问题回复详情' },
      }
    ],
  },
  {
    path: '/details',
    component: Layout,
    name: 'details',
    redirect: '/details/index',
    meta: { title: '问题详情' },
    children: [
      {
        path: 'index',
        name: 'details',
        component: () => import('@/pages/classDetails/index.vue'),
        meta: { title: '问题详情' },
      }
    ],
  },
  {
    path: '/learning',
    name: 'learning',
    redirect: '/learning/index',
    meta: { title: '学习' },
    children: [
      {
        path: 'index',
        name: 'learning',
        component: () => import('@/pages/learning/index.vue'),
        meta: { title: '学习' },
      }
    ],
  },
  {
    path: '/pay',
    name: 'pay',
    component: Layout,
    redirect: '/pay/settlement',
    meta: { title: '购买' },
    children: [
      {
        path: 'settlement',
        name: 'settlement',
        component: () => import('@/pages/pay/settlement.vue'),
        meta: { title: '结算页' },
      },
      {
        path: 'carts',
        name: 'carts',
        component: () => import('@/pages/pay/carts.vue'),
        meta: { title: '购物车' },
      },
      {
        path: 'payment',
        name: 'payment',
        component: () => import('@/pages/pay/payment.vue'),
        meta: { title: '支付页面' },
      },
      {
        path: 'success',
        name: 'success',
        component: () => import('@/pages/pay/success.vue'),
        meta: { title: '支付页面' },
      }
    ],
  },
  {
    path: '/personal',
    component: Layout,
    name: 'personal',
    redirect: '/personal/main',
    meta: { title: '个人中心' },
    children: [
      {
        path: 'main',
        name: 'personalMain',
        component: () => import('@/pages/personal/index.vue'),
        meta: { title: 'PersonalMain' },
        children:[
          {
            path: 'myClass',
            name: 'myClass',
            component: () => import('@/pages/personal/myClass.vue'),
            meta: { title: 'MyClass', active:'myClass', icon: '&#xe611;'},
          },
          {
            path: 'myExam',
            name: 'myExam',
            component: () => import('@/pages/personal/myExam.vue'),
            meta: { title: 'MyExam', active:'myExam', icon: '&#xe615;'},
          },
          {
            path: 'myExamDetails',
            name: 'myExamDetails',
            component: () => import('@/pages/personal/myExamDetails.vue'),
            meta: { title: 'ExamDetail', current: 'ExamDetail', active:'myExam', hidden: true, icon: '&#xe615;'},
          },
          {
            path: 'myOrder',
            name: 'myOrder',
            component: () => import('@/pages/personal/myOrder.vue'),
            meta: { title: 'MyOrder', active:'myOrder', icon: '&#xe60b;'},
          },
          {
            path: 'myOrderDetails',
            name: 'myOrderDetails',
            component: () => import('@/pages/personal/myOrderDetails.vue'),
            meta: { title: 'OrderDetail', current: 'OrderDetail', active:'myOrder', hidden: true, icon: '&#xe60b;'},
          },
          // {
          //   path: 'myCoupon',
          //   name: 'myCoupon',
          //   component: () => import('@/pages/personal/myCoupon.vue'),
          //   meta: { title: 'MyCoupon', active:'myCoupon', icon: '&#xe616;'},
          // },
          // {
          //   path: 'myCouponExplain',
          //   name: 'myCouponExplain',
          //   component: () => import('@/pages/personal/myCouponExplain.vue'),
          //   meta: { title: 'CouponExplain', current: 'CouponExplain', active:'myCoupon', hidden: true, icon: '&#xe616;'},
          // },
          // {
          //   path: 'myMessage',
          //   name: 'myMessage',
          //   component: () => import('@/pages/personal/myMessage.vue'),
          //   meta: { title: 'MyMessage', active:'myMessage', hidden: true, icon: '&#xe612;'},
          // },
          {
            path: 'myIntegral',
            name: 'myIntegral',
            component: () => import('@/pages/personal/myIntegral.vue'),
            meta: { title: 'MyPoints', active:'myIntegral', icon: '&#xe610;'},
          },
          {
            path: 'myIntegralRanking',
            name: 'myIntegralRanking',
            component: () => import('@/pages/personal/myIntegralRanking.vue'),
            meta: { title: 'Ranking', current: 'Ranking', active:'myIntegral', hidden: true, icon: '&#xe610;'},
          },
          // {
          //   path: 'myCollect',
          //   name: 'myCollect',
          //   component: () => import('@/pages/personal/myCollect.vue'),
          //   meta: { title: 'Collects', active:'myCollect', hidden: true, icon: '&#xe613;'},
          // },
          {
            path: 'mySet',
            name: 'mySet',
            component: () => import('@/pages/personal/mySet.vue'),
            meta: { title: 'Settings', active:'mySet', icon: '&#xe617;'},
          }
        ]
      },
    ],
  },
];
