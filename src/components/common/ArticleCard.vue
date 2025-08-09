<template>
  <div class="article-card shadow-box background-opacity" @click="$router.push({ path: `/article/${article.id}` })">
    <!-- 文章封面 -->
    <div class="article-cover">
      <el-image class="cover-image" v-once lazy :src="article.cover" fit="cover">
        <div slot="error" class="image-slot myCenter" style="background-color: var(--lightGreen)">
          <div class="error-text">
            <div>Diamond博客</div>
          </div>
        </div>
      </el-image>
      <div class="transformCenter hasVideo" v-if="article.hasVideo">
        <svg viewBox="0 0 1024 1024" width="40" height="40">
          <path
            d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.9 0.1 219.9 179 398.8 398.9 398.8 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m173 421.9L437.1 680.5c-17.7 10.2-39.8-2.6-39.8-23V368.9c0-20.4 22.1-33.2 39.8-23L687 490.2c17.7 10.2 17.7 35.8 0 46z"
            fill="#FFFFFF"></path>
        </svg>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 标题 -->
      <h3 class="article-title">{{ article.title }}</h3>

      <!-- 作者信息 -->
      <div class="article-meta">
        <span>
          <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
            <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#409EFF"></path>
            <path
              d="M654.222222 256c-17.066667 0-28.444444 11.377778-28.444444 28.444444v56.888889c0 17.066667 11.377778 28.444444 28.444444 28.444445s28.444444-11.377778 28.444445-28.444445v-56.888889c0-17.066667-11.377778-28.444444-28.444445-28.444444zM369.777778 256c-17.066667 0-28.444444 11.377778-28.444445 28.444444v56.888889c0 17.066667 11.377778 28.444444 28.444445 28.444445s28.444444-11.377778 28.444444-28.444445v-56.888889c0-17.066667-11.377778-28.444444-28.444444-28.444444z"
              fill="#FFFFFF"></path>
          </svg>
          {{ article.authorName || article.author || '匿名用户' }}
        </span>
      </div>

      <!-- 文章摘要 -->
      <div class="article-summary">
        {{ article.content }}
      </div>

      <!-- 分类和标签 -->
      <div class="article-tags">
        <!-- 分类标签 -->
        <span v-if="article.categoryName || article.category" 
              class="category-tag"
              @click.stop="$router.push({ path: '/sort', query: { categoryId: article.categoryId } })">
          <svg viewBox="0 0 1024 1024" width="15" height="15" style="vertical-align: -3px;">
            <path
              d="M179.2 153.6m89.6 0l588.8 0q89.6 0 89.6 89.6l0 486.4q0 89.6-89.6 89.6l-588.8 0q-89.6 0-89.6-89.6l0-486.4q0-89.6 89.6-89.6Z"
              fill="#FF9C55"></path>
          </svg>
          {{ article.categoryName || article.category }}
        </span>
        
        <!-- 标签列表 -->
        <template v-if="article.tags && article.tags.length > 0">
          <span v-for="(tag, index) in article.tags" :key="index" class="tag"
                @click.stop="handleTagClick(tag)">
            <svg viewBox="0 0 1024 1024" width="15" height="15" style="vertical-align: -3px;">
              <path
                d="M905.0112 560.4352l-342.784 342.784c-56.7808 56.7808-148.7872 56.7808-205.568 0l-231.5776-231.5776c-56.7808-56.7808-56.7808-148.7872 0-205.568l342.9376-342.9376a114.8928 114.8928 0 0 1 84.224-33.5872l266.3936 7.2192c60.7744 1.6384 109.7216 50.3808 111.5648 111.1552l8.2944 267.8272c1.024 31.6928-11.1104 62.3104-33.4848 84.6848z"
                fill="#8C7BFD"></path>
            </svg>
            {{ typeof tag === 'object' ? tag.name : tag }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    
    handleTagClick(tag) {
      // 处理标签点击事件，阻止冒泡到文章卡片
      const tagName = typeof tag === 'object' ? tag.name : tag;
      const tagId = typeof tag === 'object' ? tag.id : null;
      
      // 跳转到标签对应的文章列表页面
      this.$router.push({ 
        path: '/sort', 
        query: { 
          tagName: tagName,
          ...(tagId && { tagId: tagId })
        } 
      });
    }
  }
}
</script>

<style scoped>
.article-card {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  background: var(--background);
  border: 1px solid var(--lightGray);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.article-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.article-card:hover .cover-image {
  transform: scale(1.05);
}

.hasVideo {
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.article-content {
  padding: 20px;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--fontColor);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-meta {
  font-size: 12px;
  color: var(--greyFont);
  margin-bottom: 15px;
}

.article-meta span:not(:last-child) {
  margin-right: 15px;
}

.article-summary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--articleFontColor);
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 4px 8px;
  background-color: var(--maxLightGray);
  border-radius: 4px;
  font-size: 12px;
  color: var(--greyFont);
  transition: all 0.3s;
  cursor: pointer;
  user-select: none;
}

.category-tag:hover {
  background-color: var(--themeBackground);
  color: var(--white);
}

.tag {
  padding: 4px 8px;
  background-color: var(--maxLightGray);
  border-radius: 4px;
  font-size: 12px;
  color: var(--greyFont);
  transition: all 0.3s;
  cursor: pointer;
  user-select: none;
}

.tag:hover {
  background-color: var(--themeBackground);
  color: var(--white);
}

.error-text {
  font-size: 16px;
  color: var(--white);
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .article-content {
    padding: 15px;
  }

  .article-title {
    font-size: 16px;
  }

  .article-summary {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
}
</style>