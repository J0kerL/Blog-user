import request from '@/utils/request'

// 获取文章列表（分页查询）
export function getArticleListApi(params) {
  return request.get('/article/page', params)
}

// 获取文章详情
export function getArticleDetailApi(id) {
  return request.get(`/article/get/${id}`)
}

// 根据分类获取文章列表
export function getArticlesByCategoryApi(categoryId, page = 1, pageSize = 6) {
  return request.get('/article/page', {
    page,
    pageSize,
    categoryId
  })
}

// 搜索文章
export function searchArticlesApi(title, page = 1, pageSize = 10) {
  return request.get('/article/page', {
    page,
    pageSize,
    title
  })
}