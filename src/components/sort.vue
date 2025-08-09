<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div style="background: var(--background);padding-top: 40px;" class="my-animation-slide-bottom">
      <!-- 页面标题 -->
      <div class="page-title-wrap">
        <h2 class="page-title">
          <span v-if="tagName">🏷️ 标签：{{ tagName }}</span>
          <span v-else-if="search">🔍 搜索：{{ search }}</span>
          <span v-else-if="sort">📒 分类：{{ sort.name || sort.sortName }}</span>
          <span v-else>📝 全部文章</span>
        </h2>
      </div>

      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!$common.isEmpty(sort) && !$common.isEmpty(sort.labels)">
        <div v-for="(label, index) in sort.labels" :key="index"
             :class="{isActive: !$common.isEmpty(labelId) && parseInt(labelId) === label.id}"
             @click="listArticle(label)">
          <proTag :info="label.labelName+' '+label.countOfLabel"
                  :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                  style="margin: 12px">
          </proTag>
        </div>
      </div>

      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
  const twoPoem = () => import( "./common/twoPoem");
  const proTag = () => import( "./common/proTag");
  const articleList = () => import( "./articleList");
  const myFooter = () => import( "./common/myFooter");

  export default {
    components: {
      twoPoem,
      proTag,
      articleList,
      myFooter
    },

    data() {
      return {
        categoryId: this.$route.query.categoryId || this.$route.query.sortId, // 兼容旧的sortId参数
        labelId: this.$route.query.labelId,
        tagId: this.$route.query.tagId,
        tagName: this.$route.query.tagName,
        search: this.$route.query.search,
        sort: null,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          searchKey: this.$route.query.search || "",
          categoryId: this.$route.query.categoryId || this.$route.query.sortId,
          labelId: this.$route.query.labelId,
          tagId: this.$route.query.tagId
        },
        articles: []
      }
    },

    computed: {},

    watch: {
      $route() {
        this.pagination = {
          page: 1,
          pageSize: 10,
          total: 0,
          searchKey: this.$route.query.search || "",
          categoryId: this.$route.query.categoryId || this.$route.query.sortId,
          labelId: this.$route.query.labelId,
          tagId: this.$route.query.tagId
        };
        this.articles.splice(0, this.articles.length);
        this.categoryId = this.$route.query.categoryId || this.$route.query.sortId;
        this.labelId = this.$route.query.labelId;
        this.tagId = this.$route.query.tagId;
        this.tagName = this.$route.query.tagName;
        this.search = this.$route.query.search;
        this.getSort();
        this.getArticles();
      }
    },

    created() {
      this.getSort();
      this.getArticles();
    },

    mounted() {
    },

    methods: {
      pageArticles() {
        this.pagination.page = this.pagination.page + 1;
        this.getArticles();
      },

      getSort() {
        let sortInfo = this.$store.state.sortInfo;
        if (!this.$common.isEmpty(sortInfo)) {
          let sortArray = sortInfo.filter(f => {
            return f.id === parseInt(this.categoryId);
          });
          if (!this.$common.isEmpty(sortArray)) {
            this.sort = sortArray[0];
          }
        }
      },
      listArticle(label) {
        this.labelId = label.id;
        this.pagination = {
          page: 1,
          pageSize: 10,
          total: 0,
          searchKey: "",
          categoryId: this.categoryId,
          labelId: label.id
        };
        this.articles.splice(0, this.articles.length);
        this.$nextTick(() => {
          this.getArticles();
        });
      },
      getArticles() {
        const params = {
          page: this.pagination.page,
          pageSize: this.tagName ? 50 : this.pagination.pageSize // 如果是标签查询，获取更多数据用于前端过滤
        };

        // 分类筛选
        if (this.pagination.categoryId) {
          params.categoryId = this.pagination.categoryId;
        }

        // 搜索功能（非标签搜索）
        if (this.pagination.searchKey && !this.tagName) {
          params.title = this.pagination.searchKey;
        }

        // 标签ID筛选（如果后端支持）
        if (this.pagination.tagId && !this.tagName) {
          params.tagId = this.pagination.tagId;
        }

        // 注意：后端暂时没有labelId参数，这里先注释掉
        // if (this.pagination.labelId) {
        //   params.labelId = this.pagination.labelId;
        // }

        this.$http.get(this.$constant.baseURL + "/article/page", params)
          .then((res) => {
            if (res.code === 200 && !this.$common.isEmpty(res.data)) {
              // 处理文章数据，确保格式正确
              let articles = res.data.records.map(article => ({
                id: article.id,
                title: article.title,
                content: article.summary || article.content || '暂无内容摘要',
                cover: article.cover || require('@/assets/images/top-bg.png'),
                categoryId: article.categoryId,
                categoryName: article.categoryName || '未分类',
                authorName: article.authorName || 'Diamond',
                tags: Array.isArray(article.tags) ? article.tags : (article.tags ? article.tags.split(',').map(tag => tag.trim()) : []),
                hasVideo: article.hasVideo || false,
                createTime: article.createTime,
                updateTime: article.updateTime,
                status: article.status || 1 // 添加文章状态字段
              }));

              // 如果是标签查询，在前端进行过滤
              if (this.tagName) {
                articles = articles.filter(article => {
                  return article.tags && article.tags.some(tag => 
                    tag.toLowerCase().includes(this.tagName.toLowerCase()) || 
                    this.tagName.toLowerCase().includes(tag.toLowerCase())
                  );
                });
                
                // 对于标签查询，只在第一页时清空数组
                if (this.pagination.page === 1) {
                  this.articles = articles;
                } else {
                  this.articles = this.articles.concat(articles);
                }
                
                // 设置总数（标签查询时使用过滤后的数量）
                this.pagination.total = this.articles.length;
              } else {
                // 正常的分页追加
                this.articles = this.articles.concat(articles);
                this.pagination.total = res.data.total;
              }
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }
    }
  }
</script>

<style scoped>

  .sort-warp {
    width: 70%;
    max-width: 780px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .article-wrap {
    width: 70%;
    margin: 40px auto;
    min-height: 600px;
  }

  .isActive {
    animation: scale 1.5s ease-in-out infinite;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }


  .page-title-wrap {
    width: 70%;
    max-width: 780px;
    margin: 0 auto 30px;
    text-align: center;
  }

  .page-title {
    color: var(--fontColor);
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    padding: 20px;
    background: var(--background);
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  @media screen and (max-width: 900px) {
    .sort-warp {
      width: 90%;
    }

    .article-wrap {
      width: 90%;
    }

    .page-title-wrap {
      width: 90%;
    }

    .page-title {
      font-size: 24px;
    }
  }
</style>
