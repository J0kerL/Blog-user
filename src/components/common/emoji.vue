<template>
  <div>
    <transition name="body">
      <div v-show="showEmoji">
        <span class="emoji-item" v-for="(value, key, index) in emojiListURL" :key="index" @click="addEmoji(key)">
          <img loading="lazy" class="emoji" :src="value" :title="key" width="24px" height="24px" />
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    showEmoji: {
      type: Boolean
    }
  },
  data() {
    return {
      emojiList: this.$constant.emojiList,
      emojiListURL: {}
    };
  },
  created() {
    // 确保emojiList存在
    if (this.emojiList && this.emojiList.length > 0) {
      this.emojiListURL = this.getEmojiList(this.emojiList);
    } else {
      console.warn('表情列表为空，使用默认表情');
      // 使用默认表情列表
      const defaultEmojis = ['衰', '鄙视', '再见', '捂嘴', '摸鱼', '奋斗', '白眼', '可怜', '皱眉', '鼓掌'];
      this.emojiListURL = this.getEmojiList(defaultEmojis);
    }
  },
  methods: {
    addEmoji(key) {
      this.$emit("addEmoji", key);
    },
    getEmojiList(emojiList) {
      let emojiName;
      let url;
      let result = {}
      for (let i = 0; i < emojiList.length; i++) {
        emojiName = "[" + emojiList[i] + "]";
        let j = i + 1;

        // 如果有本地配置，优先使用本地配置
        if (this.$store.state.sysConfig && this.$store.state.sysConfig['webStaticResourcePrefix']) {
          url = this.$store.state.sysConfig['webStaticResourcePrefix'] + `emoji/q${j}.gif`;
        } else {
          // 使用简单的SVG表情图标
          const emojiSvgs = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD700"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF6B6B"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M16 15s-1.5-2-4-2-4 2-4 2" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4ECDC4"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><line x1="8" y1="15" x2="16" y2="15" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#45B7D1"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M9 15c1 1 2 1 3 1s2 0 3-1" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#96CEB4"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><circle cx="12" cy="15" r="2" fill="#000"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFEAA7"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M8 13s1.5 4 4 4 4-4 4-4" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#DDA0DD"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M10 15h4" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#74B9FF"/><circle cx="8" cy="9" r="1.5" fill="#000"/><circle cx="16" cy="9" r="1.5" fill="#000"/><path d="M8 15c2-2 6-2 8 0" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`
          ];

          // 循环使用SVG表情
          const svgIndex = (j - 1) % emojiSvgs.length;
          url = `data:image/svg+xml;base64,${btoa(emojiSvgs[svgIndex])}`;
        }
        result[emojiName] = url;
      }
      return result;
    }
  }
}
</script>

<style scoped>
.emoji-item {
  cursor: pointer;
  display: inline-block;
}

.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: var(--lightGray);
}

.emoji {
  margin: 0.25rem;
  /* 把此元素放置在父元素的中部 */
  vertical-align: middle;
}

.body-enter-active,
.body-leave-active {
  transition: all 0.3s;
}

.body-enter,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
