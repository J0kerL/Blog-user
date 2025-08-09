<template>
  <div>
    <div v-if="!$common.isEmpty(article)">
      <!-- 封面 -->
      <div class="article-head my-animation-slide-top">
        <!-- 背景图片 -->
        <el-image class="article-image my-el-image" v-once lazy :src="article.cover" fit="cover">
          <div slot="error" class="image-slot">
            <div class="article-image"></div>
          </div>
        </el-image>
        <!-- 文章信息 -->
        <div class="article-info-container">
          <div class="article-title">{{ article.title }}</div>
          <div class="article-info">
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path
                d="M510.4 65.5l259.69999999 0 1e-8 266.89999999c0 147.50000001-116.2 266.89999999-259.7 266.90000001-143.4 0-259.7-119.5-259.7-266.90000001 0.1-147.5 116.3-266.9 259.7-266.89999999z"
                fill="#FF9FCF"></path>
              <path
                d="M698.4 525.2l-13 0c53-48.4 86.5-117.8 86.5-195.20000001 0-10.2-0.7-20.3-1.8-30.19999999C613.8 377.50000001 438.6 444.9 266 437.7c15 33.4 36.7 63.1 63.5 87.5l-5.3 0c-122.6 0-225.5 88.1-248.8 204.1C340 677.2 597.7 609.2 862.2 585.7c-44.3-37.6-101.5-60.5-163.8-60.5z"
                fill="#FF83BB"></path>
              <path
                d="M862.2 585.7C597.7 609.2 340 677.2 75.4 729.3c-3.2 16.1-5 32.6-5 49.6 0 99.8 81.7 181.5 181.5 181.5l518.6 0c99.8 0 181.5-81.7 181.5-181.5 0.1-77.2-35-146.5-89.8-193.2z"
                fill="#FF5390"></path>
              <path
                d="M770.1 299.8C755.1 168 643.3 65.5 507.4 65.5c-146.1 0-264.5 118.4-264.5 264.5 0 38.4 8.3 74.8 23.1 107.7 172.6 7.2 347.8-60.2 504.1-137.9z"
                fill="#FF9FCF"></path>
              <path
                d="M436.4 282.1c0 24.1-19.6 43.7-43.7 43.7S349 306.2 349 282.1s19.6-43.7 43.7-43.7c24.19999999 0 43.7 19.6 43.7 43.7z"
                fill="#FFFFFF"></path>
              <path d="M625 282.1m-43.7 0a43.7 43.7 0 1 0 87.4 0 43.7 43.7 0 1 0-87.4 0Z" fill="#FFFFFF"></path>
            </svg>
            <span>&nbsp;{{ article.authorName }}</span>
          </div>
        </div>
      </div>
      <!-- 文章 -->
      <div style="background: var(--background);">
        <div class="article-container my-animation-slide-bottom">
          <!-- 暂时隐藏视频播放器，因为后端没有videoUrl字段 -->
          <!-- <div v-if="!$common.isEmpty(article.videoUrl)" style="margin-bottom: 20px">
            <videoPlayer :url="{ src: $common.decrypt(article.videoUrl) }" :cover="article.cover">
            </videoPlayer>
          </div> -->

          <!-- 文章内容 -->
          <div v-html="articleContentHtml" class="entry-content"></div>
          <!-- 分类 -->
          <div class="article-sort">
            <span
              @click="$router.push({ path: '/sort', query: { sortId: article.categoryId, labelId: article.categoryId } })">{{
                article.categoryName }}</span>
          </div>
          <!-- 作者信息 -->
          <blockquote>
            <div>
              作者：{{ article.authorName }}
            </div>
            <div>
              <span>版权&许可请详阅</span>
              <span style="color: #38f;cursor: pointer" @click="copyrightDialogVisible = true">
                版权声明
              </span>
            </div>
          </blockquote>

          <!-- 评论 -->
          <div v-if="article.status === 1">
            <comment :type="'article'" :source="article.id" :userId="article.authorId"></comment>
          </div>
        </div>

        <div id="toc" class="toc"></div>
      </div>

      <div style="background: var(--background)">
        <myFooter></myFooter>
      </div>
    </div>

    <div id="toc-button" @click="clickTocButton()">
      <i class="fa fa-align-justify" aria-hidden="true"></i>
    </div>

    <el-dialog title="版权声明" :visible.sync="copyrightDialogVisible" width="80%" :append-to-body="true"
      class="article-copy" center>
      <div style="display: flex;align-items: center;flex-direction: column">
        <el-avatar shape="square" :size="35" :src="$store.state.webInfo.avatar"></el-avatar>
        <div class="copyright-container">
          <p>
            {{ $store.state.webInfo.webName }}是指运行在{{ $constant.host }}域名及相关子域名上的网站，本条款描述了{{
              $store.state.webInfo.webName }}的网站版权声明：
          </p>
          <ul>
            <li>
              {{ $store.state.webInfo.webName }}提供的所有文章、展示的图片素材等内容部分来源于互联网平台，仅供学习参考。如有侵犯您的版权，请联系{{
                $store.state.webInfo.webName }}负责人，{{ $store.state.webInfo.webName }}承诺将在一个工作日内改正。
            </li>
            <li>
              {{ $store.state.webInfo.webName }}不保证网站内容的全部准确性、安全性和完整性，请您在阅读、下载及使用过程中自行确认，{{ $store.state.webInfo.webName
              }}亦不承担上述资源对您造成的任何形式的损失或伤害。
            </li>
            <li>未经{{ $store.state.webInfo.webName }}允许，不得盗链、盗用本站内容和资源。</li>
            <li>
              {{ $store.state.webInfo.webName }}旨在为广大用户提供更多的信息；{{ $store.state.webInfo.webName
              }}不保证向用户提供的外部链接的准确性和完整性，该外部链接指向的不由本站实际控制的任何网页上的内容，{{ $store.state.webInfo.webName }}对其合法性亦概不负责，亦不承担任何法律责任。
            </li>
            <li>
              {{ $store.state.webInfo.webName
              }}中的文章/视频（包括转载文章/视频）的版权仅归原作者所有，若作者有版权声明或文章从其它网站转载而附带有原所有站的版权声明者，其版权归属以附带声明为准；文章仅代表作者本人的观点，与{{
                $store.state.webInfo.webName }}立场无关。
            </li>
            <li>
              {{ $store.state.webInfo.webName }}自行编写排版的文章均采用
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color: #38f;text-decoration: none;">
                知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议
              </a>
            </li>
            <li>
              许可协议标识：
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                <img alt="知识共享许可协议" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
                  style="margin-top: 5px">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>


  </div>
</template>

<script>
const myFooter = () => import("./common/myFooter");
const comment = () => import("./comment/comment");
const videoPlayer = () => import("./common/videoPlayer");
import MarkdownIt from 'markdown-it';

export default {
  components: {
    myFooter,
    comment,
    videoPlayer
  },

  data() {
    return {
      id: this.$route.params.id,
      article: {},
      articleContentHtml: "",
      copyrightDialogVisible: false,
      scrollTop: 0
    };
  },
  created() {
    if (!this.$common.isEmpty(this.id)) {
      this.getArticle();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScrollPage);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScrollPage);
  },
  watch: {
    scrollTop(scrollTop, oldScrollTop) {
      let isShow = scrollTop - window.innerHeight > 30;
      if (isShow) {
        $("#toc-button").css("bottom", "14.1vh");
      } else {
        $("#toc-button").css("bottom", "8vh");
      }
    },
  },
  methods: {
    clickTocButton() {
      let display = $(".toc");
      if ("none" === display.css("display")) {
        display.css("display", "unset");
      } else {
        display.css("display", "none");
      }
    },

    onScrollPage() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (this.scrollTop < (window.innerHeight / 4)) {
        $(".toc").css("top", window.innerHeight / 4);
      } else {
        $(".toc").css("top", "90px");
      }
    },
    getTocbot() {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = this.$constant.tocbot;
      document.getElementsByTagName('head')[0].appendChild(script);

      // 引入成功
      script.onload = function () {
        tocbot.init({
          tocSelector: '#toc',
          contentSelector: '.entry-content',
          headingSelector: 'h1, h2, h3, h4, h5',
          scrollSmooth: true,
          fixedSidebarOffset: 'auto',
          scrollSmoothOffset: -100,
          hasInnerContainers: false
        });
      }
      if (this.$common.mobile()) {
        $(".toc").css("display", "none");
      }
    },
    addId() {
      let headings = $(".entry-content").find("h1, h2, h3, h4, h5, h6");
      headings.attr('id', (i, id) => id || 'toc-' + i);
    },
    getArticle() {
      this.$http.get(this.$constant.baseURL + "/article/get/" + this.id)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.article = res.data;
            const md = new MarkdownIt({ breaks: true }).use(require('markdown-it-multimd-table'));
            this.articleContentHtml = md.render(this.article.content);
            this.$nextTick(() => {
              this.$common.imgShow(".entry-content img");
              this.highlight();
              this.addId();
              this.getTocbot();
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error",
            customClass: "message-index"
          });
        });
    },
    highlight() {
      // 检查hljs是否已加载
      if (typeof window.hljs === 'undefined') {
        // 延迟500ms后重试一次
        setTimeout(() => {
          this.highlight();
        }, 500);
        return;
      }

      const hljs = window.hljs;

      let attributes = {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "false",
        contenteditable: "false"
      };

      $("pre").each(function (i, item) {
        let preCode = $(item).children("code");
        let classNameStr = preCode[0].className;
        let classNameArr = classNameStr.split(" ");

        let lang = "";
        classNameArr.some(function (className) {
          if (className.indexOf("language-") > -1) {
            lang = className.substring(className.indexOf("-") + 1, className.length);
            return true;
          }
        });

        // 语言别名映射表
        const languageAliases = {
          'mysql': 'sql',
          'postgresql': 'sql',
          'postgres': 'sql',
          'sqlite': 'sql',
          'mariadb': 'sql',
          'tsql': 'sql',
          'plsql': 'sql',
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'rb': 'ruby',
          'sh': 'bash',
          'shell': 'bash',
          'yml': 'yaml',
          'md': 'markdown',
          'vue': 'html',
          'jsx': 'javascript',
          'tsx': 'typescript'
        };

        // 如果没有指定语言，使用自动检测
        if (!lang) {
          let autoLanguage = hljs.highlightAuto(preCode.text());
          lang = autoLanguage.language || "plaintext";
        } else {
          // 处理语言别名
          let normalizedLang = lang.toLowerCase();
          if (languageAliases[normalizedLang]) {
            normalizedLang = languageAliases[normalizedLang];
          }

          // 检测语言是否存在
          let language = hljs.getLanguage(normalizedLang);
          if (!language) {
            // 语言不存在，使用自动检测
            let autoLanguage = hljs.highlightAuto(preCode.text());
            lang = autoLanguage.language || "plaintext";
          } else {
            lang = normalizedLang;
          }
        }

        $(item).addClass("highlight-wrap");
        $(item).attr(attributes);
        preCode.attr("data-rel", lang.toUpperCase()).addClass(lang.toLowerCase());

        // 启用代码高亮 - 使用新的API
        try {
          hljs.highlightElement(preCode[0]);
        } catch (e) {
          // 如果新API不存在，尝试旧API
          try {
            hljs.highlightBlock(preCode[0]);
          } catch (e2) {
            console.warn('代码高亮失败:', e2);
          }
        }

        // 启用代码行号
        if (typeof window.hljs.lineNumbersBlock === 'function') {
          window.hljs.lineNumbersBlock(preCode[0]);
        }
      });

      $("pre code").each(function (i, block) {
        $(block).attr({
          id: "hljs-" + i,
        });

        $(block).after(
          '<a class="copy-code" href="javascript:" data-clipboard-target="#hljs-' +
          i +
          '"><i class="fa fa-clipboard" aria-hidden="true"></i></a>'
        );

        // 检查ClipboardJS是否已加载
        if (typeof ClipboardJS !== 'undefined') {
          new ClipboardJS(".copy-code");
        }
      });

      if ($(".entry-content").children("table").length > 0) {
        $(".entry-content")
          .children("table")
          .wrap("<div class='table-wrapper'></div>");
      }
    }
  }
}
</script>

<style scoped>
.article-head {
  height: 40vh;
  position: relative;
}

.article-image::before {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--miniMask);
  content: "";
}

.article-info-container {
  position: absolute;
  bottom: 15px;
  left: 20%;
  color: var(--white);
}

.article-info-news {
  position: absolute;
  bottom: 10px;
  right: 20%;
  cursor: pointer;
  animation: scale 1s ease-in-out infinite;
}

.article-title {
  font-size: 28px;
  margin-bottom: 15px;
}

.article-info {
  font-size: 14px;
  user-select: none;
}

.article-info i {
  margin-right: 6px;
}

.article-info span:not(:last-child) {
  margin-right: 5px;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.article-update-time {
  color: var(--greyFont);
  font-size: 12px;
  margin: 20px 0;
  user-select: none;
}

blockquote {
  line-height: 2;
  border-left: 0.2rem solid var(--blue);
  padding: 10px 1rem;
  background-color: var(--azure);
  border-radius: 4px;
  margin: 0 0 40px 0;
  user-select: none;
  color: var(--black);
}

.article-sort {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.article-sort span {
  padding: 3px 10px;
  background-color: var(--themeBackground);
  border-radius: 5px;
  font-size: 14px;
  color: var(--white);
  transition: all 0.3s;
  margin-right: 25px;
  cursor: pointer;
  user-select: none;
}

.article-sort span:hover {
  background-color: var(--red);
}

.article-like {
  color: var(--red) !important;
}

.article-like-icon {
  font-size: 60px;
  cursor: pointer;
  color: var(--greyFont);
  transition: all 0.5s;
  border-radius: 50%;
  margin-bottom: 20px;
}

.article-like-icon:hover {
  transform: rotate(360deg);
}

.process-wrap {
  margin: 0 0 40px;
}

.process-wrap hr {
  position: relative;
  margin: 10px auto 60px;
  border: 2px dashed var(--lightGreen);
  overflow: visible;
}

.process-wrap hr:before {
  position: absolute;
  top: -14px;
  left: 5%;
  color: var(--lightGreen);
  content: '❄';
  font-size: 30px;
  line-height: 1;
  transition: all 1s ease-in-out;
}

.process-wrap hr:hover:before {
  left: calc(95% - 20px);
}

.process-wrap>>>.el-collapse-item__header {
  border-bottom: unset;
  font-size: 20px;
  background-color: var(--background);
  color: var(--lightGreen);
}

.process-wrap>>>.el-collapse-item__wrap {
  background-color: var(--background);
}

.process-wrap .el-collapse {
  border-top: unset;
  border-bottom: unset;
}

.process-wrap>>>.el-collapse-item__wrap {
  border-bottom: unset;
}

.password-content {
  font-size: 13px;
  color: var(--maxGreyFont);
  line-height: 1.5;
}

#toc-button {
  position: fixed;
  right: 3vh;
  bottom: 8vh;
  animation: slide-bottom 0.5s ease-in-out both;
  z-index: 100;
  cursor: pointer;
  font-size: 23px;
  width: 30px;
}

#toc-button:hover {
  color: var(--themeBackground);
}

.copyright-container {
  color: var(--black);
  line-height: 2.5;
  padding: 0 30px 10px;
  font-size: 16px;
}

@media screen and (max-width: 700px) {
  .article-info-container {
    left: 20px;
    max-width: 320px;
  }

  .article-info-news {
    right: 20px;
  }
}

@media screen and (max-width: 400px) {
  #toc-button {
    right: 0.5vh;
  }
}
</style>
