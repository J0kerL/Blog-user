<template>
  <div>
    <loader :loading="loading">
      <!-- 加载页面 -->
      <template slot="loader">
        <div>
          <zombie></zombie>
        </div>
      </template>
      <!-- 内容页面 -->
      <template slot="body">
        <!-- 首页图片 -->
        <el-image style="animation: header-effect 2s" class="background-image-index" v-once lazy
          :src="require('@/assets/images/top-bg.png')" fit="cover">
          <div slot="error" class="image-slot background-image-index-error"></div>
        </el-image>
        <!-- 首页文字 -->
        <div class="signature-wall myCenter my-animation-hideToShow">
          <h1 class="playful">
            <span>每日一言</span>
          </h1>
          <div class="printer" @click="getGuShi()">
            <printer :printerInfo="printerInfo">
              <template slot="paper" slot-scope="scope">
                <h3>
                  {{ scope.content }}<span class="cursor">|</span>
                </h3>
              </template>
            </printer>
          </div>
          <div id="bannerWave1"></div>
          <div id="bannerWave2"></div>
          <i class="el-icon-arrow-down" @click="navigation('.page-container-wrap')"></i>
        </div>
        <!-- 首页内容 -->
        <div class="page-container-wrap">
          <div class="page-container">
            <div class="aside-content" v-if="showAside">
              <myAside @selectSort="selectSort" @selectArticle="selectArticle">
              </myAside>
            </div>
            <div class="recent-posts">
              <div v-for="(sort, index) in sortInfo" :key="index">
                <div class="sort-article-first">
                  <div>
                    <svg viewBox="0 0 1024 1024" width="20" height="20"
                      style="vertical-align: -2px;margin-bottom: -2px">
                      <path
                        d="M367.36 482.304H195.9936c-63.3344 0-114.6368-51.3536-114.6368-114.6368V196.2496c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368V367.616c0 63.3344-51.3536 114.688-114.688 114.688zM367.36 938.752H195.9936c-63.3344 0-114.6368-51.3536-114.6368-114.6368v-171.4176c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368v171.4176c0 63.3344-51.3536 114.6368-114.688 114.6368zM828.672 938.752h-171.4176c-63.3344 0-114.6368-51.3536-114.6368-114.6368v-171.4176c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368v171.4176c0 63.3344-51.3024 114.6368-114.6368 114.6368zM828.672 482.304h-171.4176c-63.3344 0-114.6368-51.3536-114.6368-114.6368V196.2496c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368V367.616c0 63.3344-51.3024 114.688-114.6368 114.688z"
                        fill="#FF623E"></path>
                    </svg>
                    {{ sort.name || sort.sortName }}
                  </div>
                  <div class="article-more" @click="$router.push({ path: '/sort', query: { categoryId: sort.id } })">
                    <svg viewBox="0 0 1024 1024" width="20" height="20"
                      style="vertical-align: -2px;margin-bottom: -2px">
                      <path
                        d="M347.3 897.3H142.2c-30.8 0-51.4-31.7-38.9-59.9l136.1-306.1c4.9-11 4.9-23.6 0-34.6L103.3 190.6c-12.5-28.2 8.1-59.9 38.9-59.9h205.1c16.8 0 32.1 9.9 38.9 25.3l151.4 340.7c4.9 11 4.9 23.6 0 34.6L386.3 872.1c-6.9 15.3-22.1 25.2-39 25.2z"
                        fill="#009F72"></path>
                      <path
                        d="M730.4 897.3H525.3c-30.8 0-51.4-31.7-38.9-59.9l136.1-306.1c4.9-11 4.9-23.6 0-34.6L486.4 190.6c-12.5-28.2 8.1-59.9 38.9-59.9h205.1c16.8 0 32.1 9.9 38.9 25.3l151.4 340.7c4.9 11 4.9 23.6 0 34.6L769.3 872.1c-6.8 15.3-22.1 25.2-38.9 25.2z"
                        fill="#F9DB88"></path>
                    </svg>
                    MORE
                  </div>
                </div>

                <div v-if="sortArticles[sort.id] && sortArticles[sort.id].length > 0">
                  <sortArticle :articleList="sortArticles[sort.id]"></sortArticle>
                </div>
                <div v-else-if="sortArticles.hasOwnProperty(sort.id)"
                  style="padding: 20px; text-align: center; color: #999; background: #f9f9f9; margin: 10px 0; border-radius: 5px;">
                  该分类下暂无文章
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 页脚 -->
        <div style="background: var(--background)">
          <myFooter></myFooter>
        </div>
      </template>
    </loader>
  </div>
</template>
<script>
const loader = () => import("./common/loader");
const zombie = () => import("./common/zombie");
const printer = () => import("./common/printer");
const articleList = () => import("./articleList");
const sortArticle = () => import("./common/sortArticle");
const myFooter = () => import("./common/myFooter");
const myAside = () => import("./myAside");

export default {
  components: {
    loader,
    zombie,
    printer,
    articleList,
    sortArticle,
    myFooter,
    myAside
  },

  data() {
    return {
      pushDialogVisible: false,
      push: {},
      loading: false,
      showAside: true,
      isDataLoaded: false, // 标记数据是否已加载
      isLoadingData: false, // 标记是否正在加载数据
      printerInfo: "你看对面的青山多漂亮",
      guShi: {
        "content": "",
        "origin": "",
        "author": "",
        "category": ""
      },
      sortArticles: {}
    };
  },

  watch: {
    sortInfo: {
      handler(newVal) {
        // 只有在数据未加载且不在加载中时才触发
        if (newVal && newVal.length > 0 && !this.isDataLoaded && !this.isLoadingData) {
          this.getSortArticles();
        }
      },
      deep: true
    }
  },

  created() {
    this.getGuShi();
    // 获取分类信息，然后统一获取文章数据
    this.getSortInfo();
  },

  computed: {
    sortInfo() {
      return this.$store.state.sortInfo;
    }
  },

  mounted() {
    setTimeout(() => {
      this.push = this.$common.pushNotification(this.$store.state.webInfo.notices, false);
      if (!this.$common.isEmpty(this.push)) {
        if ("0" !== localStorage.getItem("showPushNotification_" + this.push['链接'])) {
          this.pushDialogVisible = true;
          localStorage.setItem("showPushNotification_" + this.push['链接'], "0");
        }
      }
    }, 2000);
  },

  methods: {
    async selectSort(sort) {
      // 直接跳转到分类页面
      this.$router.push({ path: '/sort', query: { categoryId: sort.id } });
    },

    async selectArticle(articleSearch) {
      // 直接跳转到分类页面进行搜索
      this.$router.push({ path: '/sort', query: { search: articleSearch } });
    },
    async getSortArticles() {
      // 防止重复请求
      if (!this.sortInfo || this.sortInfo.length === 0 || this.isLoadingData || this.isDataLoaded) {
        return;
      }

      this.isLoadingData = true;

      try {
        // 一次性获取所有文章，避免多次API调用
        const response = await this.$http.get(this.$constant.baseURL + "/article/page", {
          page: 1,
          pageSize: 50 // 获取足够多的文章用于分组显示
        });

        if (response && response.code === 200 && response.data && response.data.records) {
          const allArticles = response.data.records;

          // 初始化分类文章对象
          const newSortArticles = {};

          // 为每个分类初始化空数组
          this.sortInfo.forEach(sort => {
            newSortArticles[sort.id] = [];
          });

          // 将文章按分类分组，每个分类最多显示6篇
          allArticles.forEach(article => {
            const categoryId = article.categoryId;
            if (newSortArticles[categoryId] && newSortArticles[categoryId].length < 6) {
              // 处理文章数据，确保字段名匹配sortArticle组件的期望
              const processedArticle = {
                id: article.id,
                articleTitle: article.title || article.articleTitle || '无标题',
                articleCover: article.cover || article.articleCover || require('@/assets/images/top-bg.png'),
                articleContent: article.summary || article.content || article.articleContent || '暂无内容摘要',
                categoryId: article.categoryId,
                categoryName: article.categoryName || '未分类',
                authorName: article.authorName || 'Diamond',
                // 确保标签数据格式正确
                tags: Array.isArray(article.tags) ? article.tags : (article.tags ? article.tags.split(',').map(tag => tag.trim()) : []),
                hasVideo: article.hasVideo || false,
                createTime: article.createTime,
                updateTime: article.updateTime,
                viewCount: article.viewCount || 0,
                commentCount: article.commentCount || 0,
                likeCount: article.likeCount || 0,
                sortId: article.categoryId,
                labelId: article.labelId,
                sort: {
                  sortName: article.categoryName || '未分类'
                },
                label: {
                  labelName: article.labelName || '默认标签'
                }
              };

              newSortArticles[categoryId].push(processedArticle);
            }
          });

          // 一次性更新所有分类文章数据
          this.sortArticles = newSortArticles;
          this.isDataLoaded = true; // 标记数据已加载
        } else {
          // 初始化空的分类文章对象
          const newSortArticles = {};
          this.sortInfo.forEach(sort => {
            newSortArticles[sort.id] = [];
          });
          this.sortArticles = newSortArticles;
          this.isDataLoaded = true;
        }
      } catch (error) {
        // 初始化空的分类文章对象
        const newSortArticles = {};
        this.sortInfo.forEach(sort => {
          newSortArticles[sort.id] = [];
        });
        this.sortArticles = newSortArticles;
        this.isDataLoaded = true;
      } finally {
        this.isLoadingData = false;
      }
    },
    navigation(selector) {
      let pageId = document.querySelector(selector);
      window.scrollTo({
        top: pageId.offsetTop,
        behavior: "smooth"
      });
    },
    pushUrl(url) {
      window.open(url);
    },
    getGuShi() {
      let that = this;
      let xhr = new XMLHttpRequest();
      xhr.open('get', this.$constant.jinrishici);
      xhr.timeout = 5000; // 设置5秒超时

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              that.guShi = JSON.parse(xhr.responseText);
              that.printerInfo = that.guShi.content;
            } catch (e) {
              // JSON解析失败，使用默认文案
              that.printerInfo = "你看对面的青山多漂亮";
            }
          } else {
            // 请求失败，使用默认文案
            that.printerInfo = "你看对面的青山多漂亮";
          }
        }
      };

      xhr.onerror = function() {
        // 网络错误，使用默认文案
        that.printerInfo = "你看对面的青山多漂亮";
      };

      xhr.ontimeout = function() {
        // 超时，使用默认文案
        that.printerInfo = "你看对面的青山多漂亮";
      };

      xhr.send();
    },

    async getSortInfo() {
      // 检查缓存标志，避免重复请求
      if (this.$store.state.cacheFlags.sortInfoLoaded && this.sortInfo && this.sortInfo.length > 0) {
        this.getSortArticles();
        return;
      }

      try {
        const response = await this.$http.get(this.$constant.baseURL + "/category/list");

        if (response.code === 200 && !this.$common.isEmpty(response.data)) {
          // 将分类数据存储到store中，这会自动设置缓存标志
          this.$store.commit('loadSortInfo', response.data);

          // 确保分类信息加载完成后再获取文章
          this.$nextTick(() => {
            if (this.sortInfo && this.sortInfo.length > 0) {
              this.getSortArticles();
            }
          });
        }
      } catch (error) {
        // 如果获取分类失败，使用静态数据作为备用方案
        const staticSortInfo = [
          { id: 1, name: "Spring Boot", sortName: "Spring Boot" },
          { id: 2, name: "Vue.js", sortName: "Vue.js" },
          { id: 3, name: "MySQL", sortName: "MySQL" },
          { id: 4, name: "Java", sortName: "Java" },
          { id: 5, name: "前端技术", sortName: "前端技术" }
        ];
        this.$store.commit("loadSortInfo", staticSortInfo);
        this.$nextTick(() => {
          this.getSortArticles();
        });
      }
    }
  }
}
</script>

<style scoped>
.background-image-index {
  width: 100vw;
  height: 50vh;
  position: fixed;
  z-index: -1;
}

.background-image-index::before {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);
  content: '';
}

.background-image-index-error {
  background-color: var(--lightGreen);
  width: 100vw;
  height: 50vh;
  position: fixed;
  z-index: -1;
}

.signature-wall {
  /* 向下排列 */
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  height: 50vh;
  overflow: hidden;
}

.playful {
  color: var(--white);
  font-size: 40px;
}

.sort-article-first {
  margin: 40px auto 20px;
  display: flex;
  justify-content: space-between;
  color: var(--greyFont);
  border-bottom: 1px dashed var(--lightGray);
  padding-bottom: 5px;
}

.article-more {
  cursor: pointer;
  transition: all 0.3s;
}

.article-more:hover {
  color: var(--lightGreen);
  font-weight: 700;
  transform: scale(1.1);
}

/*.playful span {*/
/*  position: relative;*/
/*  color: #5362f6;*/
/*  text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,*/
/*  1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,*/
/*  2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,*/
/*  3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,*/
/*  4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,*/
/*  5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,*/
/*  6px 6px #e485f8;*/
/*  animation: scatter 1.75s infinite;*/
/*  font-weight: normal;*/
/*}*/

/*.playful span:nth-child(2n) {*/
/*  color: #ed625c;*/
/*  text-shadow: 0.25px 0.25px #f2a063, 0.5px 0.5px #f2a063, 0.75px 0.75px #f2a063,*/
/*  1px 1px #f2a063, 1.25px 1.25px #f2a063, 1.5px 1.5px #f2a063, 1.75px 1.75px #f2a063,*/
/*  2px 2px #f2a063, 2.25px 2.25px #f2a063, 2.5px 2.5px #f2a063, 2.75px 2.75px #f2a063,*/
/*  3px 3px #f2a063, 3.25px 3.25px #f2a063, 3.5px 3.5px #f2a063, 3.75px 3.75px #f2a063,*/
/*  4px 4px #f2a063, 4.25px 4.25px #f2a063, 4.5px 4.5px #f2a063, 4.75px 4.75px #f2a063,*/
/*  5px 5px #f2a063, 5.25px 5.25px #f2a063, 5.5px 5.5px #f2a063, 5.75px 5.75px #f2a063,*/
/*  6px 6px #f2a063;*/
/*  animation-delay: 0.3s;*/
/*}*/

/*.playful span:nth-child(3n) {*/
/*  color: #ffd913;*/
/*  text-shadow: 0.25px 0.25px #6ec0a9, 0.5px 0.5px #6ec0a9, 0.75px 0.75px #6ec0a9,*/
/*  1px 1px #6ec0a9, 1.25px 1.25px #6ec0a9, 1.5px 1.5px #6ec0a9, 1.75px 1.75px #6ec0a9,*/
/*  2px 2px #6ec0a9, 2.25px 2.25px #6ec0a9, 2.5px 2.5px #6ec0a9, 2.75px 2.75px #6ec0a9,*/
/*  3px 3px #6ec0a9, 3.25px 3.25px #6ec0a9, 3.5px 3.5px #6ec0a9, 3.75px 3.75px #6ec0a9,*/
/*  4px 4px #6ec0a9, 4.25px 4.25px #6ec0a9, 4.5px 4.5px #6ec0a9, 4.75px 4.75px #6ec0a9,*/
/*  5px 5px #6ec0a9, 5.25px 5.25px #6ec0a9, 5.5px 5.5px #6ec0a9, 5.75px 5.75px #6ec0a9,*/
/*  6px 6px #6ec0a9;*/
/*  animation-delay: 0.15s;*/
/*}*/

/*.playful span:nth-child(5n) {*/
/*  color: #555bff;*/
/*  text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,*/
/*  1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,*/
/*  2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,*/
/*  3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,*/
/*  4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,*/
/*  5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,*/
/*  6px 6px #e485f8;*/
/*  animation-delay: 0.4s;*/
/*}*/

/*.playful span:nth-child(7n) {*/
/*  color: #ff9c55;*/
/*  text-shadow: 0.25px 0.25px #ff5555, 0.5px 0.5px #ff5555, 0.75px 0.75px #ff5555,*/
/*  1px 1px #ff5555, 1.25px 1.25px #ff5555, 1.5px 1.5px #ff5555, 1.75px 1.75px #ff5555,*/
/*  2px 2px #ff5555, 2.25px 2.25px #ff5555, 2.5px 2.5px #ff5555, 2.75px 2.75px #ff5555,*/
/*  3px 3px #ff5555, 3.25px 3.25px #ff5555, 3.5px 3.5px #ff5555, 3.75px 3.75px #ff5555,*/
/*  4px 4px #ff5555, 4.25px 4.25px #ff5555, 4.5px 4.5px #ff5555, 4.75px 4.75px #ff5555,*/
/*  5px 5px #ff5555, 5.25px 5.25px #ff5555, 5.5px 5.5px #ff5555, 5.75px 5.75px #ff5555,*/
/*  6px 6px #ff5555;*/
/*  animation-delay: 0.25s;*/
/*}*/

.printer {
  cursor: pointer;
  color: var(--white);
  background: var(--translucent);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

#bannerWave1 {
  height: 84px;
  background: var(--bannerWave1);
  position: absolute;
  width: 200%;
  bottom: 0;
  z-index: 10;
  animation: gradientBG 120s linear infinite;
}

#bannerWave2 {
  height: 100px;
  background: var(--bannerWave2);
  position: absolute;
  width: 400%;
  bottom: 0;
  z-index: 5;
  animation: gradientBG 120s linear infinite;
}

/* 光标 */
.cursor {
  margin-left: 1px;
  animation: hideToShow 0.7s infinite;
  font-weight: 200;
}

.el-icon-arrow-down {
  font-size: 40px;
  font-weight: bold;
  color: var(--white);
  position: absolute;
  bottom: 60px;
  animation: my-shake 1.5s ease-out infinite;
  z-index: 15;
  cursor: pointer;
}

.page-container-wrap {
  background: var(--background);
  position: relative;
}

.page-container {
  display: flex;
  justify-content: center;
  width: 90%;
  padding: 0 20px 40px 20px;
  margin: 0 auto;
  flex-direction: row;
}

.recent-posts {
  width: 70%;
}

.announcement {
  padding: 22px;
  border: 1px dashed var(--lightGray);
  color: var(--greyFont);
  border-radius: 10px;
  display: flex;
  margin: 40px auto 40px;
}

.announcement i {
  color: var(--themeBackground);
  font-size: 22px;
  margin: auto 0;
  animation: scale 0.8s ease-in-out infinite;
}

.announcement div div {
  margin-left: 20px;
  line-height: 30px;
}

.aside-content {
  width: calc(30% - 40px);
  user-select: none;
  margin-top: 40px;
  margin-right: 40px;
  max-width: 300px;
  float: right;
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

.push-title {
  font-weight: bold;
  font-size: 20px;
}

.push-el-image {
  width: 80%;
  min-height: 100px;
  max-height: 400px;
  border-radius: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.push-button {
  position: relative;
  background: var(--lightGreen);
  cursor: pointer;
  width: 230px;
  border-radius: 2rem;
  line-height: 35px;
  color: var(--white);
}

.push-button-title {
  margin-left: 20px;
  font-weight: bold;
}

.push-button-car {
  position: absolute;
  margin-left: 55px;
  animation: passing 4s linear infinite;
}

@media screen and (max-width: 1100px) {
  .recent-posts {
    width: 100%;
  }

  .page-container {
    width: 100%;
  }
}

@media screen and (max-width: 1000px) {

  .page-container {
    /* 文章栏与侧标栏垂直排列 */
    flex-direction: column;
  }

  .aside-content {
    width: 100%;
    max-width: unset;
    float: unset;
    margin: 40px auto 0;
  }
}

@media screen and (max-width: 768px) {

  h1 {
    font-size: 35px;
  }
}
</style>
