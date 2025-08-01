<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div style="background: var(--background);padding-top: 40px;" class="my-animation-slide-bottom">
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
        sort: null,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          searchKey: "",
          categoryId: this.$route.query.categoryId || this.$route.query.sortId,
          labelId: this.$route.query.labelId
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
          searchKey: "",
          categoryId: this.$route.query.categoryId || this.$route.query.sortId,
          labelId: this.$route.query.labelId
        };
        this.articles.splice(0, this.articles.length);
        this.categoryId = this.$route.query.categoryId || this.$route.query.sortId;
        this.labelId = this.$route.query.labelId;
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
          pageSize: this.pagination.pageSize
        };
        
        if (this.pagination.categoryId) {
          params.categoryId = this.pagination.categoryId;
        }
        
        // 注意：后端暂时没有labelId参数，这里先注释掉
        // if (this.pagination.labelId) {
        //   params.labelId = this.pagination.labelId;
        // }
        
        this.$http.get(this.$constant.baseURL + "/article/page", params)
          .then((res) => {
            if (res.code === 200 && !this.$common.isEmpty(res.data)) {
              // 处理文章数据，确保格式正确
              const articles = res.data.records.map(article => ({
                id: article.id,
                title: article.title,
                content: article.content || article.summary || '暂无内容摘要',
                cover: article.cover || require('@/assets/images/bg1.png'),
                categoryId: article.categoryId,
                categoryName: article.categoryName || '未分类',
                authorName: article.authorName || 'Diamond',
                tags: article.tags || [],
                hasVideo: article.hasVideo || false,
                createTime: article.createTime,
                updateTime: article.updateTime
              }));
              
              this.articles = this.articles.concat(articles);
              this.pagination.total = res.data.total;
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


  @media screen and (max-width: 900px) {
    .sort-warp {
      width: 90%;
    }

    .article-wrap {
      width: 90%;
    }
  }
</style>
