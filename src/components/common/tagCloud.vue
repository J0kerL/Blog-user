<template>
    <div class="tag-cloud-container">
        <div class="card-content2-title">
            <i class="el-icon-collection-tag card-content2-icon"></i>
            <span>标签云</span>
        </div>
        <div class="tag-cloud-content">
            <div v-for="(tag, index) in tagList" :key="tag.id" class="tag-item" :style="{
                fontSize: getTagSize(tag.articleCount) + 'px',
                color: getTagColor(index)
            }" @click="selectTag(tag)">
                {{ tag.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagCloud',
    data() {
        return {
            tagList: [],
            colorList: [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
                '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
                '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
            ]
        }
    },
    created() {
        this.getTagList();
    },
    methods: {
        async getTagList() {
            try {
                const response = await this.$http.get("/tag/list");
                if (response && response.code === 200 && response.data) {
                    this.tagList = response.data.map(tag => ({
                        id: tag.id,
                        name: tag.name,
                        articleCount: tag.articleCount || 0
                    }));
                }
            } catch (error) {
                console.error("获取标签列表失败:", error);
                // 如果API失败，设置空数组，不显示标签云
                this.tagList = [];
            }
        },
        getTagSize(articleCount) {
            // 根据文章数量计算标签大小，范围在12-20px之间
            const minSize = 12;
            const maxSize = 20;
            const maxCount = Math.max(...this.tagList.map(tag => tag.articleCount));
            const minCount = Math.min(...this.tagList.map(tag => tag.articleCount));

            if (maxCount === minCount) return 16;

            const ratio = (articleCount - minCount) / (maxCount - minCount);
            return Math.floor(minSize + ratio * (maxSize - minSize));
        },
        getTagColor(index) {
            return this.colorList[index % this.colorList.length];
        },
        selectTag(tag) {
            // 跳转到分类页面，通过标签筛选文章
            this.$router.push({
                path: '/sort',
                query: { tagId: tag.id, tagName: tag.name }
            });
        }
    }
}
</script>

<style scoped>
.tag-cloud-container {
    padding: 25px;
    border-radius: 10px;
    animation: hideToShow 1s ease-in-out;
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

.tag-cloud-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    line-height: 1.8;
}

.tag-item {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-weight: 500;
    display: inline-block;
}

.tag-item:hover {
    background-color: var(--themeBackground);
    color: var(--white) !important;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>