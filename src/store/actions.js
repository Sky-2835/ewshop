import {aCartList} from '../network/shopcart.js'

const actions = {
   upCartLIst(context,payload){
       aCartList().then(res=>{
           context.commit('addCart',{count:res.data.data.length || 0,})
       }).catch(err=>err)
   }
}

export default actions

