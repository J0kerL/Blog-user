<template>
  <div v-if="!$common.isEmpty(articleList)" class="recent-post-container">
    <div class="recent-post-item shadow-box background-opacity wow"
         v-for="(article, index) in articleList"
         :key="index"
         @click="$router.push({path: `/article/${article.id}`})">
      <!-- 封面 -->
      <div class="recent-post-item-image">
        <el-image class="my-el-image"
                  v-once
                  lazy
                  :src="article.articleCover"
                  fit="cover">
          <div slot="error" class="image-slot myCenter" style="background-color: var(--lightGreen)">
            <div class="error-text">
              <div>遇事不决，可问春风</div>
            </div>
          </div>
        </el-image>
        <div class="transformCenter hasVideo" v-if="article.hasVideo">
          <svg viewBox="0 0 1024 1024" width="60" height="60">
            <path
              d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.9 0.1 219.9 179 398.8 398.9 398.8 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m173 421.9L437.1 680.5c-17.7 10.2-39.8-2.6-39.8-23V368.9c0-20.4 22.1-33.2 39.8-23L687 490.2c17.7 10.2 17.7 35.8 0 46z"
              fill="#0C0C0C"></path>
          </svg>
        </div>
      </div>
      <!-- 内容 -->
      <div class="recent-post-item-post">
        <!-- 作者信息 -->
        <div class="post-meta">
          <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
            <path d="M512 74.667C270.933 74.667 74.667 270.933 74.667 512S270.933 949.333 512 949.333 949.333 753.067 949.333 512 753.067 74.667 512 74.667zM512 256c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m0 576c-97.067 0-185.6-42.667-243.2-115.2 2.133-78.933 157.867-122.133 243.2-122.133s241.067 43.2 243.2 122.133C697.6 789.333 609.067 832 512 832z" fill="#4A90E2"></path>
          </svg>
          作者：{{ article.authorName }}
        </div>

        <!-- 标题 -->
        <el-tooltip placement="top" effect="light">
          <div slot="content">{{ article.articleTitle }}</div>
          <h3>{{ article.articleTitle }}</h3>
        </el-tooltip>

        <!-- 内容 -->
        <div class="recent-post-desc">
          {{ article.articleContent }}
        </div>

        <!-- 文章标签 -->
        <div class="sort-label">
          <span v-for="(tag, tagIndex) in article.tags"
                :key="tagIndex"
                style="margin-right: 8px">
            <svg viewBox="0 0 1024 1024" width="15" height="15" style="vertical-align: -3px;">
              <path
                d="M905.0112 560.4352l-342.784 342.784c-56.7808 56.7808-148.7872 56.7808-205.568 0l-231.5776-231.5776c-56.7808-56.7808-56.7808-148.7872 0-205.568l342.9376-342.9376a114.8928 114.8928 0 0 1 84.224-33.5872l266.3936 7.2192c60.7744 1.6384 109.7216 50.3808 111.5648 111.1552l8.2944 267.8272c1.024 31.6928-11.1104 62.3104-33.4848 84.6848z"
                fill="#8C7BFD"></path>
              <path
                d="M675.2256 491.4688c-82.176 0-149.0432-66.8672-149.0432-149.0432s66.8672-149.0432 149.0432-149.0432 149.0432 66.8672 149.0432 149.0432-66.8672 149.0432-149.0432 149.0432z m0-192.2048c-23.808 0-43.2128 19.3536-43.2128 43.2128 0 23.808 19.3536 43.2128 43.2128 43.2128 23.808 0 43.2128-19.3536 43.2128-43.2128s-19.4048-43.2128-43.2128-43.2128z"
                fill="#FFE37B"></path>
            </svg> {{ tag }}
          </span>
          <!-- 如果没有标签，显示默认标签 -->
          <span v-if="!article.tags || article.tags.length === 0">
            <svg viewBox="0 0 1024 1024" width="15" height="15" style="vertical-align: -3px;">
              <path
                d="M905.0112 560.4352l-342.784 342.784c-56.7808 56.7808-148.7872 56.7808-205.568 0l-231.5776-231.5776c-56.7808-56.7808-56.7808-148.7872 0-205.568l342.9376-342.9376a114.8928 114.8928 0 0 1 84.224-33.5872l266.3936 7.2192c60.7744 1.6384 109.7216 50.3808 111.5648 111.1552l8.2944 267.8272c1.024 31.6928-11.1104 62.3104-33.4848 84.6848z"
                fill="#8C7BFD"></path>
              <path
                d="M675.2256 491.4688c-82.176 0-149.0432-66.8672-149.0432-149.0432s66.8672-149.0432 149.0432-149.0432 149.0432 66.8672 149.0432 149.0432-66.8672 149.0432-149.0432 149.0432z m0-192.2048c-23.808 0-43.2128 19.3536-43.2128 43.2128 0 23.808 19.3536 43.2128 43.2128 43.2128 23.808 0 43.2128-19.3536 43.2128-43.2128s-19.4048-43.2128-43.2128-43.2128z"
                fill="#FFE37B"></path>
            </svg> 默认标签
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      articleList: {
        type: Array
      }
    },
    methods: {}
  }
</script>

<style scoped>

  .recent-post-container {
    display: flex;
    flex-wrap: wrap;
  }

  .recent-post-item {
    position: relative;
    user-select: none;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px;
    height: 350px;
    flex-shrink: 0;
    width: calc(100% / 3 - 20px);
    cursor: pointer;
    animation: zoomIn 0.8s ease-in-out;
  }

  .recent-post-item-image {
    width: 100%;
    height: 170px;
    position: relative;
  }

  .recent-post-item-image >>> .el-image__inner {
    transition: all 1s;
  }

  .recent-post-item-image >>> .el-image__inner:hover {
    transform: scale(1.2);
  }

  .recent-post-item-post {
    width: 100%;
    height: 180px;
    padding: 10px 15px;
  }

  .recent-post-item-post h3 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .post-meta {
    font-size: 12px;
    color: var(--greyFont);
  }

  .recent-post-desc {
    font-size: 13px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .sort-label {
    position: absolute;
    bottom: 15px;
  }

  .sort-label span {
    padding: 2px 4px;
    background-color: var(--maxLightGray);
    border-radius: 3px;
    font-size: 14px;
    color: var(--greyFont);
    transition: all 0.3s;
    cursor: pointer;
    user-select: none;
  }

  .sort-label span:hover {
    background-color: var(--themeBackground);
    color: var(--white);
  }

  .error-text {
    font-size: 20px;
    line-height: 1.8;
    letter-spacing: 4px;
    color: var(--white);
  }

  .hasVideo {
    padding: 0 20px;
    background: var(--maxMaxWhiteMask);
    border-radius: 15px;
  }

  @media screen and (max-width: 1400px) {
    .recent-post-item {
      width: calc(100% / 2 - 20px);
    }
  }

  @media screen and (max-width: 600px) {
    .recent-post-item {
      width: calc(100% - 20px);
    }
  }

</style>
