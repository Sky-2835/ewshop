import Vue from 'vue'
import { Button,Notify,Swipe, SwipeItem,Lazyload,Badge,Tab,Tabs,
         Sidebar, SidebarItem,Collapse, CollapseItem,Card ,
         Image as VanImage, Tag,Form,Field,Toast,Checkbox,CheckboxGroup ,
         Stepper ,SwipeCell ,SubmitBar,Empty ,Icon ,AddressList,AddressEdit ,
         ContactCard,Popup,Grid, GridItem ,Dialog,
        List,PullRefresh} from 'vant'


Vue.use(Button)
Vue.use(Notify)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload,{
    loading:require('@/assets/logo.png'),
})
Vue.use(Badge)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Card)
Vue.use(VanImage)
Vue.use(Tag)
Vue.use(Form)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Stepper)
Vue.use(SwipeCell)
Vue.use(SubmitBar)
Vue.use(Empty)
Vue.use(Icon)
Vue.use(AddressList)
Vue.use(AddressEdit)
Vue.use(ContactCard)
Vue.use(Popup)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Dialog)
Vue.use(PullRefresh)
Vue.use(List)

