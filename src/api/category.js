import request from '@/utils/request'

// 获取分类列表
export function getCategoryListApi() {
  return request.get('/category/list')
}

// 获取分类详情
export function getCategoryDetailApi(id) {
  return request.get(`/category/get/${id}`)
}