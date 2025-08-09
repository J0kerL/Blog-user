<template>
  <div>
    <!-- 评论框 -->
    <div style="margin-bottom: 40px">
      <div class="comment-head">
        <i class="el-icon-edit-outline" style="font-weight: bold;font-size: 22px;"></i> 留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div v-show="!isGraffiti">
          <commentBox @showGraffiti="isGraffiti = !isGraffiti"
                      @submitComment="submitComment">
          </commentBox>
        </div>
        <!-- 画笔 -->
<!--        <div v-show="isGraffiti">-->
<!--          <graffiti @showComment="isGraffiti = !isGraffiti"-->
<!--                    @addGraffitiComment="addGraffitiComment">-->
<!--          </graffiti>-->
<!--        </div>-->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span style="font-size: 1.15rem">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>
      <!-- 评论详情 -->
      <div id="comment-content" class="commentInfo-detail"
           v-for="(item, index) in comments"
           :key="index">
        <!-- 头像 -->
        <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.userAvatar"></el-avatar>

        <div style="flex: 1;padding-left: 12px">
          <!-- 评论信息 -->
          <div style="display: flex;justify-content: space-between">
            <div>
              <span class="commentInfo-username">{{ item.username }}</span>
              <span class="commentInfo-master" v-if="item.userId === currentUserId">主人翁</span>
              <span class="commentInfo-other">{{ $common.getDateDiff(item.createTime) }}</span>
            </div>
            <div class="commentInfo-reply" @click="replyDialog(item, item)">
              <span v-if="item.childCommentCount > 0">{{item.childCommentCount}} </span><span>回复</span>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.content"></span>
          </div>
          <!-- 回复模块 -->
          <div v-if="!$common.isEmpty(item.childComments) && !$common.isEmpty(item.childComments.records)">
            <div class="commentInfo-detail" v-for="(childItem, i) in item.childComments.records" :key="i">
              <!-- 头像 -->
              <el-avatar shape="square" class="commentInfo-avatar" :size="30" :src="childItem.userAvatar"></el-avatar>

              <div style="flex: 1;padding-left: 12px">
                <!-- 评论信息 -->
                <div style="display: flex;justify-content: space-between">
                  <div>
                    <span class="commentInfo-username-small">{{ childItem.username }}</span>
                    <span class="commentInfo-master" v-if="childItem.userId === currentUserId">主人翁</span>
                    <span class="commentInfo-other">{{ $common.getDateDiff(childItem.createTime) }}</span>
                  </div>
                  <div>
                    <span class="commentInfo-reply" @click="replyDialog(childItem, item)">回复</span>
                  </div>
                </div>
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <span v-html="childItem.content"></span>
                </div>
              </div>
            </div>
            <!-- 查看更多子评论按钮 -->
            <div class="pagination-wrap" v-if="item.childComments && item.childComments.records && item.childComments.records.length > 0 && item.childComments.records.length < item.childCommentCount">
              <div class="pagination"
                   @click="loadMoreChildComments(item)">
                查看更多回复
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <proPage :current="pagination.current"
               :size="pagination.size"
               :total="pagination.total"
               :buttonSize="6"
               :color="$constant.commentPageColor"
               @toPage="toPage">
      </proPage>
    </div>

    <div v-else class="myCenter" style="color: var(--greyFont)">
      <i>来发第一个留言啦~</i>
    </div>

    <el-dialog title="留言"
               :visible.sync="replyDialogVisible"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // const graffiti = () => import( "./graffiti");
  const commentBox = () => import( "./commentBox");
  const proPage = () => import( "../common/proPage");

  export default {
    components: {
      // graffiti,
      commentBox,
      proPage
    },
    props: {
      source: {
        type: Number
      },
      type: {
        type: String
      },
      // 新增：从父组件接收评论总数，避免重复获取
      commentCount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isGraffiti: false,
        total: this.commentCount,
        replyDialogVisible: false,
        floorComment: {},
        replyComment: {},
        comments: [],
        pagination: {
          current: 1,
          size: 10,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: null
        }
      };
    },

    computed: {
      currentUserId() {
        return this.$store.state.currentUser?.id || null;
      }
    },

    created() {
      this.getComments(this.pagination);
      // 如果父组件已提供评论总数，则不再调用getTotal
      if (!this.commentCount) {
        this.getTotal();
      }
    },
    methods: {
      toPage(page) {
        this.pagination.current = page;
        window.scrollTo({
          top: document.getElementById('comment-content').offsetTop
        });
        this.getComments(this.pagination);
      },
      getTotal() {
        // 实时获取评论总数（包括子评论）
        this.$http.get(this.$constant.baseURL + "/comment/count/" + this.source)
          .then((res) => {
            if (res.code === 200 && res.data !== null) {
              this.total = res.data;
            } else {
              this.total = 0;
            }
          })
          .catch((error) => {
            console.error('获取评论总数失败:', error);
            this.total = 0;
          });
      },
      toChildPage(floorComment) {
        // 确保childComments对象存在并初始化current属性
        if (!floorComment.childComments) {
          floorComment.childComments = { current: 1, records: [], total: 0 };
        }
        if (!floorComment.childComments.current) {
          floorComment.childComments.current = 1;
        }
        
        floorComment.childComments.current += 1;
        let pagination = {
          current: floorComment.childComments.current,
          size: 5,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: floorComment.id
        }
        this.getComments(pagination, floorComment, true);
      },
      emoji(comments, flag) {
        comments.forEach(c => {
          if (c.content) {
            c.content = c.content.replace(/\n/g, '<br/>');
            c.content = this.$common.faceReg(c.content);
            c.content = this.$common.pictureReg(c.content);
          }
          if (flag) {
            if (!this.$common.isEmpty(c.childComments) && !this.$common.isEmpty(c.childComments.records)) {
              c.childComments.records.forEach(cc => {
                if (cc.content) {
                  cc.content = cc.content.replace(/\n/g, '<br/>');
                  cc.content = this.$common.faceReg(cc.content);
                  cc.content = this.$common.pictureReg(cc.content);
                }
              });
            }
          }
        });
      },
      getComments(pagination, floorComment = {}, isToPage = false) {
        // 构建符合后端接口的查询参数
        let queryParams = {
          page: pagination.current, // 后端使用page
          pageSize: pagination.size, // 后端使用pageSize
          articleId: pagination.source // 后端使用articleId
        };

        // 如果是查询子评论，需要设置parentId
        if (pagination.floorCommentId) {
          queryParams.parentId = pagination.floorCommentId;
        }

        this.$http.get(this.$constant.baseURL + "/comment/page", queryParams)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              if (this.$common.isEmpty(floorComment)) {
                // 主评论处理
                this.comments = res.data.records || [];
                this.pagination.total = res.data.total || 0;
                this.total = this.pagination.total; // 更新总数
                this.emoji(this.comments, true);
                
                // 为每个主评论默认加载前两条子评论
                this.comments.forEach(comment => {
                  if (comment.childCommentCount > 0) {
                    this.loadDefaultChildComments(comment);
                  }
                });
              } else {
                // 子评论处理
                if (isToPage === false) {
                  floorComment.childComments = res.data;
                } else {
                  floorComment.childComments.total = res.data.total;
                  floorComment.childComments.records = floorComment.childComments.records.concat(res.data.records);
                }
                this.emoji(floorComment.childComments.records, false);
              }
              this.$nextTick(() => {
                this.$common.imgShow("#comment-content .pictureReg");
              });
            } else {
              // 没有评论数据时的处理
              if (this.$common.isEmpty(floorComment)) {
                this.comments = [];
                this.pagination.total = 0;
                this.total = 0;
              }
            }
          })
          .catch((error) => {
            console.error('获取评论失败:', error);
            // 不显示错误消息，避免干扰用户体验
            if (this.$common.isEmpty(floorComment)) {
              this.comments = [];
              this.pagination.total = 0;
              this.total = 0;
            }
          });
      },
      addGraffitiComment(graffitiComment) {
        this.submitComment(graffitiComment);
      },
      submitComment(commentContent) {
        // 构建符合后端接口的评论数据
        let comment = {
          articleId: this.source, // 后端使用articleId
          content: commentContent, // 后端使用content
          parentId: null // 主评论的parentId为null
        };

        this.$http.post(this.$constant.baseURL + "/comment/add", comment)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '评论发表成功！'
            });
            this.pagination = {
              current: 1,
              size: 10,
              total: 0,
              source: this.source,
              commentType: this.type,
              floorCommentId: null
            }
            this.getComments(this.pagination);
            // 如果父组件提供了评论总数，则重新获取总数以保持一致
            this.getTotal();
            // 通知父组件评论数已更新
            this.$emit('comment-count-updated', this.total);
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitReply(commentContent) {
        // 构建符合后端接口的回复评论数据
        let comment = {
          articleId: this.source, // 后端使用articleId
          content: commentContent, // 后端使用content
          // 如果回复的是主评论，parentId就是主评论的id
          // 如果回复的是子评论，parentId应该是主评论的id（floorComment.id）
          parentId: this.floorComment.id // 统一回复到主评论下
        };

        let floorComment = this.floorComment;

        this.$http.post(this.$constant.baseURL + "/comment/add", comment)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '回复发表成功！'
            });
            
            // 重新加载主评论的子评论
            let pagination = {
              current: 1,
              size: Math.max(2, floorComment.childComments ? floorComment.childComments.records.length + 1 : 2),
              total: 0,
              source: this.source,
              commentType: this.type,
              floorCommentId: floorComment.id
            }
            this.getComments(pagination, floorComment, false);
            this.getTotal();
            // 通知父组件评论数已更新
            this.$emit('comment-count-updated', this.total);
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.handleClose();
      },
      loadDefaultChildComments(floorComment) {
        // 默认加载前两条子评论
        if (!floorComment.childComments) {
          this.$set(floorComment, 'childComments', { current: 1, records: [], total: 0 });
        }
        
        let pagination = {
          current: 1,
          size: 2, // 默认只加载2条
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: floorComment.id
        }
        this.getComments(pagination, floorComment, false);
      },
      loadMoreChildComments(floorComment) {
        // 加载更多子评论
        if (!floorComment.childComments) {
          this.$set(floorComment, 'childComments', { current: 1, records: [], total: 0 });
        }
        
        // 计算下一页
        const nextPage = Math.floor(floorComment.childComments.records.length / 5) + 1;
        
        let pagination = {
          current: nextPage,
          size: 5,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: floorComment.id
        }
        this.getComments(pagination, floorComment, true); // 使用追加模式
      },
      loadChildComments(floorComment) {
        // 加载所有子评论
        if (!floorComment.childComments) {
          this.$set(floorComment, 'childComments', { current: 1, records: [], total: 0 });
        }
        
        let pagination = {
          current: 1,
          size: 5,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: floorComment.id
        }
        this.getComments(pagination, floorComment, false);
      },
      replyDialog(comment, floorComment) {
        this.replyComment = comment;
        this.floorComment = floorComment;
        this.replyDialogVisible = true;
      },
      handleClose() {
        this.replyDialogVisible = false;
        this.floorComment = {};
        this.replyComment = {};
      }
    }
  }
</script>

<style scoped>

  .comment-head {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    user-select: none;
    color: var(--themeBackground);
  }

  .commentInfo-title {
    margin-bottom: 20px;
    color: var(--greyFont);
    user-select: none;
  }

  #comment-content {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .commentInfo-detail {
    display: flex;
  }

  .commentInfo-avatar {
    border-radius: 5px;
  }

  .commentInfo-username {
    color: var(--orangeRed);
    font-size: 16px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-username-small {
    color: var(--orangeRed);
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-master {
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 0.2rem;
    font-size: 12px;
    padding: 2px 4px;
    margin-right: 5px;
  }

  .commentInfo-other {
    font-size: 12px;
    color: var(--greyFont);
    user-select: none;
  }

  .commentInfo-reply {
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    background: var(--themeBackground);
    border-radius: 0.2rem;
    padding: 3px 6px;
  }

  .commentInfo-content {
    margin: 15px 0 25px;
    padding: 18px 20px;
    background: var(--commentContent);
    border-radius: 12px;
    color: var(--black);
    word-break: break-word;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .pagination {
    padding: 6px 20px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }
</style>
