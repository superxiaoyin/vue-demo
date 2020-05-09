<template>
    <div class="topSearch" v-if="type == 'line'">
        <div class="searchLine">
            <input
                type="text"
                :placeholder="placeholder"
                :maxlength="maxlength"
                class="topInput"
                v-model="key"
            />
            <span class="del" v-show="!!key" @click="clear()">
                <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUAAADKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysodvSJTAAAADHRSTlMAwZIU8tcGK7wamCo8kG0LAAAAZElEQVQI12NgYNgUc1SbAQiSzgDBMgYGth4Q40QCA9MZnzNnjpxRYKg5MvHMGUmf4ww6Z4RlDhqeOcQQc+agobDMmaMMQJXChkCCwQfCOAKXgiuGa4cbCLcCbikQFMW4qjMwAAAqeD/9gK3lXgAAAABJRU5ErkJggg=="
                />
            </span>
            <img
                class="searchBtnImg"
                @click="searchInfo()"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRTE0QUVERjMyNEUxMUU5QTBGNDg4NTIyQzc3NDFFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRTE0QUVFMDMyNEUxMUU5QTBGNDg4NTIyQzc3NDFFNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFMTRBRUREMzI0RTExRTlBMEY0ODg1MjJDNzc0MUU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJFMTRBRURFMzI0RTExRTlBMEY0ODg1MjJDNzc0MUU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Jyac7AAABHNJREFUeNrMmQtoTmEYx89nM7ZhzD3klutQNIWZ2FzmkuQyDdEoRCHCIg0rU5p7EiG5NYxcInLNJeSSTC4jdzO5zEYYNv+nPaee3r595z3nuz716/vO5Tvn/73ned/nclzJ2d8MLywctARtQQyoAX6CIvAUfLS6wLmMOo5uatcagfFgBOgDank49y24AA6DM6DM8IFVs3FuJ7CbhWwEgy0EkzUHk8Fx8ApkaPzGJyMdDVaCOcr5FeAhuA6egE/sGuQmzUAc6Aca8/lNQDZfZx446C/RXfniHcW+QrAZ7AWvLX7vAglgGpgAIkBTkAuGg1nghy/dYzCPoin4O1gEWoNVGoLNp3EVpIP24JA4Rm5zaeDqkoa+Ep0ETgj/uw26gTXgt8OnSj6dypTwvnhwHsJjvBXdGRzhR0l2FCSCF27OpZuNAllgJ+ircU8a7V7iSZELHoHwcKeio9iHzX9Os34c+OVmJTF9egYoB1c0XYbsEUgW63gST3ZHopfxrDddgtbjf8rEXUG+yCsH+fdQkAl22RBN9gykCHdbjNGOtyu6HZgvJl2qMsJR7Oe92b9p+fri5ZJ7j8QKLRvtil4o/Hi54sNhII9FDuUw7SvbzE+VrDdGO0lXdCyYoqzD0jI5yKQr7uK1Ifeg6y0Vu+bqih4rRnmTsqzR+jqT/bvM8INB+Fl8PODNFIx2rI7oYSIY7FPOWQLW8hPwp+3lzwh2QUvRifyZr6wANTjcbjX8b6fF9wQr0c3Ypw0O29KSeZIUB0B0voiUna1EtxLbBcpxily3AiCY/LqC126yNlai64pttdJoAV4agbMikR54TE0jxba6nG0NwASU9pc/I61EfxfbNZXjN43AWqSIyB7d44NSHgXTWihuUqXo52I7LlhqEVAixQR8ZiW6FDzm7X5cIgXDqLKvzt/v6gSXS6L4TAiS6NHi+wUd0Xli39QguEY05zYGz7ErOqIvivA9kbtGgbTpoD5/34NAU64jmtbnHJGwZAdwlBtyxWRwFrneThGwTST+aVwbBsIogNUz02KM8ns7on8pCfh2rpT9aRliAr7TLW7VwvaESEMp/p+ySl68sCnc9DHdcxJGucRp32O+CN8UIa+BHj4WTPfYIWIC9QG76fY+3In+yZXMHbF2k/A5hr0uqztrYFS2fXO4WDaNmpQbQC6ERzhti1HVPYDSXJFI0UVvgEEOxFL7gTql1Ggfw/vKeYTVAHPASrinkSvlZkqWSFl7AipC74MFoINFxtafC2Xq460Tq0Qh//mcKiKjR+EuzdcX3fnm7kJ8MY/gZ6OybVuX50IbUeGb9gds4b5KMR+n3t5IN9elfmIaJmeZU9GmDQGz+TPCxu8+cpVPo/1GOWZbuMvhi6JYFk5VfBduqdXmhs5XHvUCztYo+blcVZOHXhSxK2gLd3n5dssXBa0ZzrWFVzNCxFgQpQ7HrSZnyIjWFL4fwsNCSrQi/Jibw7TGzw450UJ4ahXCu4ekaAvhJ0NWtOIq9CqQuqrjsC/vvwADAHNFLOJ9Ak5NAAAAAElFTkSuQmCC"
            />
        </div>
    </div>
    <div class="topSearch" v-else>
        <span class="topSearchBar">
            <input
                type="text"
                :placeholder="placeholder"
                :maxlength="maxlength"
                class="topInput"
                v-model="key"
            />
            <span class="del" v-show="!!key" @click="clear()">
                <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUAAADKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysodvSJTAAAADHRSTlMAwZIU8tcGK7wamCo8kG0LAAAAZElEQVQI12NgYNgUc1SbAQiSzgDBMgYGth4Q40QCA9MZnzNnjpxRYKg5MvHMGUmf4ww6Z4RlDhqeOcQQc+agobDMmaMMQJXChkCCwQfCOAKXgiuGa4cbCLcCbikQFMW4qjMwAAAqeD/9gK3lXgAAAABJRU5ErkJggg=="
                />
            </span>
        </span>
        <span class="topBtn" @click="searchInfo()">
            <div class="btnSearch">{{btnText}}</div>
        </span>
    </div>
</template>
<script>
export default {
    props: {
        btnText: {
            type: String,
            default: "搜索"
        },
        placeholder: {
            type: String,
            default: "输入搜索内容"
        },
        maxlength: Number,
        type: {
            type: String,
            default: ""
        },
        isEmpty: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            key: "",
        }
    },
    methods: {
        searchInfo: function () {
            this.$emit("searchInfo", this.key);
        },
        clear: function () {
            this.$emit("input", "");
            if(!!this.isEmpty){
                this.$emit("searchInfo", '');
            }
        }
    },
    watch: {
        key(newVal) {
            this.$emit("input", newVal);
        },
        value(newVal) {
            this.key = newVal;
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../style/variables.less";
.topSearch {
    background-color: #fff;
    padding-bottom: 0.2rem;
    padding-top: 0.2rem;
    // padding: 0 0.3rem;
    // height: 1rem;
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .searchLine {
        border-bottom: 2px solid @color-blue;
        width: 100%;
        position: relative;
        .topInput {
            height: 0.9rem;
            padding-right: 0.95rem;
        }
        .del {
            position: absolute;
            top: 0.29rem;
            right: 0.6rem;
            cursor: pointer;
        }
        .searchBtnImg {
            position: absolute;
            right: 0;
            top: 0.22rem;
            width: 0.45rem;
            cursor: pointer;
        }
    }

    .topSearchBar {
        margin-right: 0.3rem;
        flex: auto;
        position: relative;

        .topInput {
            border: 0;
            height: 0.6rem;
            border-radius: 0.06rem;
            text-align: left;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjVBOUFFRDcxNTdDMTFFOUFCNDJBQzM2REFBNkFFOEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjVBOUFFRDgxNTdDMTFFOUFCNDJBQzM2REFBNkFFOEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NUE5QUVENTE1N0MxMUU5QUI0MkFDMzZEQUE2QUU4QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NUE5QUVENjE1N0MxMUU5QUI0MkFDMzZEQUE2QUU4QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvafyDkAAAEfSURBVHjaYvz//z8DJYAR2QCXjk+qQKoaiL2AWASInwLxXiBu21PBdwuvAUDNIE0rgZgHi7pvQBwBNGQzugQTVLMKkubFQAziM0PphUDMBcQroOpQAAuUroZpBtoShyR/F4gTgBpB7HggrgTiZAwXAIEblG7CEVZtUNoDqxeAQBJK38NhwF0oLYHLgDdQWhGHAZpQ+hkuA7ZB6Vp0BUD/cwKpuVDuFlyBCPJjKCigoAHWDMQPgFgJiGcDsRkQ/0MyCGs68AdSy6BRhg7+QV17EojdgTH1Ed0LDEDBjUDKEBrvT6CaXgDxfCC2BOI7QGwOxOuAlrFiTcr4ADQRHQBiaSB2BFp4AMUFhABQA8gFDkCcDsSHSXYBUbmRHAAQYAAH91oIb51vHAAAAABJRU5ErkJggg==)
                #f2f3f5 0.1rem center no-repeat;
            background-size: 0.34rem 0.33rem;
            padding-left: 0.6rem;
            padding-right: 0.6rem;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }

        .del {
            position: absolute;
            top: 0.15rem;
            right: 0.2rem;
            cursor: pointer;
            padding: 0.2rem;
            margin: -0.2rem;
        }
    }

    .topBtn {
        flex: 0 0 1.5rem;
        font-size: 0.32rem;

        .btnSearch {
            background-color: @color-blue;
            height: 0.6rem;
            line-height: 0.6rem;
            text-align: center;
            border-radius: 0.06rem;
            color: #fff;
            cursor: pointer;

            &:active {
                background-color: @color-blue-press;
            }
        }
    }
}

@media screen and (max-width: 550px) {
    .topSearch {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }
}

@media screen and (min-width: 550px) {
    .topSearch {
        .topBtn {
            flex: 0 0 2rem;
            font-size: 14px;

            .btnSearch {
                &:hover {
                    background-color: @color-blue-hover;
                }
                &:active {
                    background-color: @color-blue-press;
                }
            }
        }
    }
}
</style>