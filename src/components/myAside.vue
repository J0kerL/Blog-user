<template>
  <div>
    <div class="myAside-container">
      <!-- 网站信息 -->
      <div v-if="!$common.mobile()" class="card-content1 shadow-box background-opacity">
        <el-avatar style="margin-top: 20px" class="user-avatar" :size="120"
          :src="!$common.isEmpty($store.state.currentUser) ? $store.state.currentUser.avatar : 'https://diamond-blog.oss-cn-beijing.aliyuncs.com/defaultAvatar.jpg'"></el-avatar>
        <div class="web-name">{{ displayName }}</div>
        <div class="web-info">
          <div class="blog-info-box">
            <span>文章</span>
            <span class="blog-info-num">{{ isLoggedIn ? userStats.articleCount : (dashboardStats.articleCount || 0) }}</span>
          </div>
          <div class="blog-info-box">
            <span>评论</span>
            <span class="blog-info-num">{{ isLoggedIn ? userStats.commentCount : (dashboardStats.commentCount || 0) }}</span>
          </div>
          <div class="blog-info-box">
            <span>{{ isLoggedIn ? '贡献值' : '访问量' }}</span>
            <span class="blog-info-num">{{ isLoggedIn ? '666' : (dashboardStats.viewCount || 0) }}</span>
          </div>
        </div>

      </div>

      <!-- 搜索 -->
      <div style="padding: 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out"
        class="shadow-box background-opacity wow">
        <div style="color: var(--lightGreen);font-size: 20px;font-weight: bold;margin-bottom: 10px">
          搜索
        </div>
        <div style="display: flex">
          <input class="ais-SearchBox-input" type="text" v-model="articleSearch" placeholder="搜索文章" maxlength="32">
          <div class="ais-SearchBox-submit" @click="selectArticle()">
            <svg style="margin-top: 3.5px;margin-left: 18px" viewBox="0 0 1024 1024" width="20" height="20">
              <path
                d="M51.2 508.8c0 256.8 208 464.8 464.8 464.8s464.8-208 464.8-464.8-208-464.8-464.8-464.8-464.8 208-464.8 464.8z"
                fill="#51C492"></path>
              <path
                d="M772.8 718.4c48-58.4 76.8-132.8 76.8-213.6 0-186.4-151.2-337.6-337.6-337.6-186.4 0-337.6 151.2-337.6 337.6 0 186.4 151.2 337.6 337.6 337.6 81.6 0 156-28.8 213.6-76.8L856 896l47.2-47.2-130.4-130.4zM512 776c-149.6 0-270.4-121.6-270.4-271.2S363.2 233.6 512 233.6c149.6 0 271.2 121.6 271.2 271.2C782.4 654.4 660.8 776 512 776z"
                fill="#FFFFFF"></path>
            </svg>
          </div>
        </div>
      </div>



      <!-- 最新文章 -->
      <div v-if="!$common.isEmpty(latestArticles)"
        style="padding: 25px;border-radius: 10px;animation: hideToShow 1s ease-in-out"
        class="shadow-box background-opacity wow">
        <div class="card-content2-title">
          <span>📰最新文章</span>
        </div>
        <div v-for="(article, index) in latestArticles" :key="index"
          @click="$router.push({ path: `/article/${article.id}` })">
          <div class="aside-post-detail">
            <div class="aside-post-image">
              <el-image lazy class="my-el-image" :src="article.cover || article.articleCover" fit="contain">
                <div slot="error" class="image-slot">
                  <div class="error-aside-image">
                    {{ article.authorName || article.username }}
                  </div>
                </div>
              </el-image>
              <div class="hasVideo transformCenter" v-if="article.hasVideo">
                <svg viewBox="0 0 1024 1024" width="30" height="30">
                  <path
                    d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.9 0.1 219.9 179 398.8 398.9 398.8 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m173 421.9L437.1 680.5c-17.7 10.2-39.8-2.6-39.8-23V368.9c0-20.4 22.1-33.2 39.8-23L687 490.2c17.7 10.2 17.7 35.8 0 46z"
                    fill="#0C0C0C"></path>
                </svg>
              </div>
            </div>
            <div class="aside-post-title">
              {{ article.title || article.articleTitle }}
            </div>
          </div>
        </div>
      </div>



      <!-- 分类 -->
      <div class="shadow-box background-opacity wow"
        style="padding: 25px 25px 5px;border-radius: 10px;animation: hideToShow 1s ease-in-out">
        <div class="card-content2-title">
          <i class="el-icon-folder-opened card-content2-icon"></i>
          <span>分类</span>
        </div>
        <div v-for="(sort, index) in sortInfo" :key="index" class="post-sort" @click="selectSort(sort)">
          <div>
            <span v-for="(s, i) in sort.name.split('')" :key="i">{{ s }}</span>
          </div>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="shadow-box background-opacity wow">
        <tagCloud></tagCloud>
      </div>


    </div>


  </div>
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";
const tagCloud = () => import("./common/tagCloud");

export default {
  components: {
    vueSeamlessScroll,
    tagCloud
  },
  data() {
    return {
      pagination: {
        page: 1,
        pageSize: 5
      },
      latestArticles: [],
      articleSearch: "",
      dashboardStats: {
        commentCount: 0,
        articleCount: 0,
        viewCount: 0
      },
      userStats: {
        articleCount: 0,
        commentCount: 0
      },
      tagList: [],
      selectedTag: null
    }
  },
  computed: {
    webInfo() {
      return this.$store.state.webInfo;
    },
    sortInfo() {
      return this.$store.getters.navigationBar;
    },
    displayName() {
      // 如果用户已登录，显示用户名；否则显示"Diamond博客"
      if (!this.$common.isEmpty(this.$store.state.currentUser) && this.$store.state.currentUser.username) {
        return this.$store.state.currentUser.username;
      }
      return "Diamond博客";
    },
    isLoggedIn() {
      // 判断用户是否已登录
      return !this.$common.isEmpty(this.$store.state.currentUser) && this.$store.state.currentUser.username;
    }
  },
  created() {
    this.getDashboardStats();
    this.getCategoryList();
    this.getLatestArticles();
    // 如果用户已登录，获取用户个人统计数据
    if (this.isLoggedIn) {
      this.getUserStats();
    }
  },
  watch: {
    // 监听用户登录状态变化
    isLoggedIn(newVal) {
      if (newVal) {
        // 用户登录后，获取个人统计数据
        this.getUserStats();
      } else {
        // 用户退出登录后，清空个人统计数据
        this.userStats = {
          articleCount: 0,
          commentCount: 0
        };
      }
    }
  },
  methods: {
    selectSort(sort) {
      console.log('侧边栏点击分类:', sort);
      this.$emit("selectSort", sort);
    },
    selectArticle() {
      this.$emit("selectArticle", this.articleSearch);
    },

    getLatestArticles() {
      this.$http.get("/article/page", this.pagination)
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            this.latestArticles = res.data.records.map(article => ({
              id: article.id,
              title: article.title,
              articleTitle: article.title,
              cover: article.cover || require('@/assets/images/top-bg.png'),
              articleCover: article.cover || require('@/assets/images/top-bg.png'),
              authorName: article.authorName || 'Diamond',
              username: article.authorName || 'Diamond',
              createTime: article.createTime,
              hasVideo: article.hasVideo || false
            }));
          }
        })
        .catch((error) => {
          console.error("获取最新文章失败:", error);
        });
    },
    // 获取仪表盘统计数据
    getDashboardStats() {
      this.$http.get("/dashboard/stats")
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            this.dashboardStats = {
              commentCount: res.data.commentCount || 0,
              articleCount: res.data.articleCount || 0,
              viewCount: res.data.viewCount || 0
            };
          }
        })
        .catch((error) => {
          console.error("获取仪表盘统计数据失败:", error);
          // 设置默认值
          this.dashboardStats = {
            commentCount: 0,
            articleCount: 0,
            viewCount: 0
          };
        });
    },

    // 获取分类列表数据
    getCategoryList() {
      this.$http.get("/category/list")
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            // 将后端返回的分类数据转换为前端需要的格式并存储到store
            const categoryData = res.data.map(category => ({
              id: category.id,
              name: category.name,
              sortName: category.name,
              description: category.description || `${category.name}相关文章`,
              articleCount: category.articleCount || 0,
              sortType: 0 // 添加sortType字段，确保能被navigationBar getter过滤到
            }));

            // 更新store中的分类数据
            this.$store.commit("loadSortInfo", categoryData);
          }
        })
        .catch((error) => {
          console.error("获取分类数据失败:", error);
          // 如果API失败，使用默认分类数据
          const defaultCategories = [
            { id: 1, name: "Spring Boot", sortName: "Spring Boot", description: "Spring Boot相关文章", articleCount: 0, sortType: 0 },
            { id: 2, name: "Vue.js", sortName: "Vue.js", description: "Vue.js相关文章", articleCount: 0, sortType: 0 },
            { id: 3, name: "MySQL", sortName: "MySQL", description: "MySQL相关文章", articleCount: 0, sortType: 0 },
            { id: 4, name: "Java", sortName: "Java", description: "Java相关文章", articleCount: 0, sortType: 0 },
            { id: 5, name: "前端技术", sortName: "前端技术", description: "前端技术相关文章", articleCount: 0, sortType: 0 }
          ];
          this.$store.commit("loadSortInfo", defaultCategories);
        });
    },

    // 获取用户个人统计数据
    getUserStats() {
      if (!this.isLoggedIn) {
        return;
      }

      // 调用后端获取当前登录用户的个人统计数据API
      this.$http.get("/user/stats", {}, false)
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            this.userStats = {
              articleCount: res.data.articleCount || 0,
              commentCount: res.data.commentCount || 0
            };
          }
        })
        .catch((error) => {
          console.error("获取用户个人统计数据失败:", error);
          // 设置默认值
          this.userStats = {
            articleCount: 0,
            commentCount: 0
          };
        });
    },

  }
}
</script>

<style scoped>
.myAside-container>div:not(:last-child) {
  margin-bottom: 30px;
}



.card-content1 {
  background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.card-content1 :not(:first-child) {
  z-index: 10;
}

.web-name {
  font-size: 30px;
  font-weight: bold;
  margin: 15px 0 10px 0;
}

.web-info {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.blog-info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.blog-info-num {
  margin-top: 4px;
  margin-bottom: 8px;
}

.collection-btn {
  position: relative;
  margin-top: 12px;
  background: var(--lightGreen);
  cursor: pointer;
  width: 65%;
  height: 35px;
  border-radius: 1rem;
  text-align: center;
  line-height: 35px;
  color: var(--white);
  overflow: hidden;
  z-index: 1;
  margin-bottom: 25px;
}

.collection-btn::before {
  background: var(--gradualRed);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: "";
  transform: scaleX(0);
  transform-origin: 0;
  transition: transform 0.5s ease-out;
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  border-radius: 1rem;
  z-index: -1;
}

.collection-btn:hover::before {
  transform: scaleX(1);
}

.card-content2-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--lightGreen);
  font-weight: bold;
}

.card-content2-icon {
  color: var(--red);
  margin-right: 5px;
  animation: scale 1s ease-in-out infinite;
}

.aside-post-detail {
  display: flex;
  cursor: pointer;
}

.aside-post-image {
  width: 40%;
  min-height: 60px;
  height: 60px;
  border-radius: 6px;
  margin-right: 8px;
  overflow: hidden;
  position: relative;
}

.aside-post-image .my-el-image {
  width: 100%;
  height: 100%;
}

.aside-post-image .el-image__inner {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

.error-aside-image {
  background: var(--themeBackground);
  color: var(--white);
  padding: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.aside-post-title {
  width: 60%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.aside-post-date {
  margin-top: 8px;
  margin-bottom: 20px;
  color: var(--greyFont);
  font-size: 12px;
}

.post-sort {
  border-radius: 1rem;
  margin-bottom: 15px;
  line-height: 30px;
  transition: all 0.3s;
}

.post-sort:hover {
  background: var(--themeBackground);
  padding: 2px 15px;
  cursor: pointer;
  color: var(--white);
}





.ais-SearchBox-input {
  padding: 0 14px;
  height: 30px;
  width: calc(100% - 50px);
  outline: 0;
  border: 2px solid var(--lightGreen);
  border-right: 0;
  border-radius: 40px 0 0 40px;
  color: var(--maxGreyFont);
  background: var(--white);
}

.ais-SearchBox-submit {
  height: 30px;
  width: 50px;
  border: 2px solid var(--lightGreen);
  border-left: 0;
  border-radius: 0 40px 40px 0;
  background: var(--white);
  cursor: pointer;
}

.hasVideo {
  padding: 2px 10px 0;
  background: var(--maxMaxWhiteMask);
  border-radius: 6px;
}
</style>
