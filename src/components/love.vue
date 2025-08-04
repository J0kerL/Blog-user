<template>
  <div>
    <!-- 封面 -->
    <div class="bg-wrap my-animation-slide-top">
      <!-- 背景图片 -->
      <el-image class="love-image my-el-image" lazy :src="love.bgCover" fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>

      <!-- 对象 -->
      <div class="love-wrap transformCenter">
        <div>
          <el-avatar class="love-avatar" :src="love.manCover"></el-avatar>
          <div class="love-title">
            {{ love.manName }}
          </div>
        </div>
        <div>
          <svg class="love-img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#F83856" />
          </svg>
        </div>
        <div>
          <el-avatar class="love-avatar" :src="love.womanCover"></el-avatar>
          <div class="love-title">
            {{ love.womanName }}
          </div>
        </div>
      </div>

      <div id="bannerWave1"></div>
      <div id="bannerWave2"></div>
    </div>

    <!-- 内容 -->
    <div class="love-container">
      <div class="myCenter love-content">
        <!-- 时间 -->
        <div>
          <!-- 计时 -->
          <div>
            <div class="love-time-title1">
              这是我们一起走过的
            </div>
            <div class="love-time1">
              第
              <span class="love-time1-item">{{ timing.year }}</span>
              年
              <span class="love-time1-item">{{ timing.month }}</span>
              月
              <span class="love-time1-item">{{ timing.day }}</span>
              日
              <span class="love-time1-item">{{ timing.hour }}</span>
              时
              <span class="love-time1-item">{{ timing.minute }}</span>
              分
              <span class="love-time1-item">{{ timing.second }}</span>
              秒
            </div>
          </div>
          <!-- 倒计时 -->
          <div class="love-time-title2"
            v-if="!$common.isEmpty(love.countdownTitle) || !$common.isEmpty(love.countdownTime)">
            {{ love.countdownTitle }}: {{ countdownChange }}
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer-container">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>

const myFooter = () => import("./common/myFooter");

export default {
  components: {
    myFooter
  },

  data() {
    return {
      love: {
        bgCover: "https://diamond-blog.oss-cn-beijing.aliyuncs.com/top-bg.png",
        manCover: "https://diamond-blog.oss-cn-beijing.aliyuncs.com/Conan.png",
        womanCover: "https://diamond-blog.oss-cn-beijing.aliyuncs.com/MouriRan.png",
        manName: "刘洪",
        womanName: "熊雨",
        countdownTitle: "春节倒计时",
        countdownTime: "2026-02-17 00:00:00",
        timing: "2024-03-11 00:00:00"
      },

      countdownChange: "",
      timing: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
    }
  },

  computed: {},

  watch: {},

  created() {
    this.initLoveTime();
  },

  mounted() {

  },

  methods: {
    // 初始化爱情时间计算
    initLoveTime() {
      this.getLove();
      this.countdown();
      // 每秒更新一次时间
      setInterval(() => {
        this.getLove();
        this.countdown();
      }, 1000);
    },


    getLove() {
      if (this.$common.isEmpty(this.love.timing)) {
        return;
      }
      let diff = this.$common.timeDiff(this.love.timing);
      this.timing.year = diff.diffYear;
      this.timing.month = diff.diffMonth;
      this.timing.day = diff.diffDay;
      this.timing.hour = diff.diffHour;
      this.timing.minute = diff.diffMinute;
      this.timing.second = diff.diffSecond;
    },
    countdown() {
      if (this.$common.isEmpty(this.love.countdownTime)) {
        return;
      }
      let countdown = this.$common.countdown(this.love.countdownTime);
      this.countdownChange = countdown.d + "天" + countdown.h + "时" + countdown.m + "分" + countdown.s + "秒";
    },

  }
}
</script>

<style scoped>
.love-container {
  background-image: linear-gradient(to right, rgba(37, 82, 110, 0.1) 1px, var(--background) 1px), linear-gradient(to bottom, rgba(37, 82, 110, 0.1) 1px, var(--background) 1px);
  background-size: 3rem 3rem;
  /*background: var(--background);*/
}

.bg-wrap {
  height: 55vh;
  position: relative;
  overflow: hidden;
}

.love-image::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--miniMask);
}

.love-wrap {
  width: 90%;
  background: rgba(255, 255, 255, 0.1);
  max-width: 950px;
  border-radius: 3em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 50px 70px 30px 70px;
}

.love-avatar {
  border: rgba(255, 255, 255, 0.2) 4px solid;
  width: 180px;
  height: 180px;
}

.love-title {
  margin-top: 15px;
  text-align: center;
  font-size: 25px;
  font-weight: 700;
  color: var(--white);
}

.love-img {
  animation: imgScale 2s linear infinite;
  width: 120px;
  height: 120px;
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

.love-content {
  max-width: 1200px;
  overflow: hidden;
  margin: 20px auto 0;
  user-select: none;
}

.love-time-title1 {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.2rem;
  line-height: 4rem;
  text-align: center;
  background-image: linear-gradient(270deg, #ff4500, #ffa500, #ffd700, #90ee90, #00ffff, #1e90ff, #9370db, #ff69b4, #ff4500);
  -webkit-background-clip: text;
  animation: jianBian 60s linear infinite;
  width: 3000px;
  color: rgba(0, 0, 0, 0);
}

.love-time-title2 {
  text-align: center;
  font-size: 1.5rem;
  line-height: 4rem;
  font-weight: 600;
  letter-spacing: 2px;
}

.love-time1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
}

.love-time1-item {
  font-size: 4rem;
  font-weight: 700;
}

.footer-container {
  margin-top: 146px;
  width: 100%;
}







@media screen and (max-width: 800px) {
  .love-wrap {
    border-radius: 1.5em;
    padding: 40px 30px 10px 30px;
  }

  .love-avatar {
    width: 120px;
    height: 120px;
  }

  .love-img {
    width: 100px;
    height: 100px;
  }

  .love-time1 {
    font-size: 1.4rem;
  }

  .love-time1-item {
    font-size: 3rem;
  }
}

@media screen and (max-width: 600px) {
  .love-wrap {
    padding: 30px 20px 10px 20px;
  }

  .love-avatar {
    width: 100px;
    height: 100px;
  }

  .love-img {
    width: 80px;
    height: 80px;
  }

  .love-time1 {
    font-size: 1rem;
  }

  .love-time1-item {
    font-size: 1.8rem;
  }

  .love-time-title2 {
    font-size: 1.2rem;
  }

}
</style>
