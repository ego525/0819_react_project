import axios from 'axios'
import {message} from 'antd'
import NProgress from 'nprogress'
import store from '../redux/store'
import {deleteUserInfo} from '../redux/actions/login_action'
import {BASE_URL} from '../config'
import qs from 'querystring'
import 'nprogress/nprogress.css'

//请求基本路径
axios.defaults.baseURL = BASE_URL

//请求拦截器
axios.interceptors.request.use((config)=>{
	NProgress.start()//进度条开始
	//1.获取已经保存的token
	let {token} = store.getState().userInfo
	//2.携带token
	if(token) config.headers.Authorization = 'atguigu_' + token
	let {method,data} = config
	//统一处理将所有post参数都改为urlencoded形式
	if(method.toUpperCase() === 'POST' && data instanceof Object){
		config.data = qs.stringify(data)
	}
	return config
})

//响应拦截器
axios.interceptors.response.use(
	(response)=>{
		NProgress.done()//进度条结束
		return response.data//返回真正数据
	},
	(error)=>{
		NProgress.done()
		if(error.response.status === 401){
			message.error('身份验证失败，请重新登录')
			store.dispatch(deleteUserInfo())
		}else{
			//统一处理所有请求失败
			message.error('请求出错，请联系管理员')
		}
		return new Promise(()=>{})//中断Promise链
	})

export default axios