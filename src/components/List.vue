<template>
  <div>
    <Header>列表</Header>
    <div class="content" ref="scroll" @scroll="loadMore">
      <ul>
        <router-link v-for="(book,index) in books" :to="{name: 'detail', params: {bid: book.bookId}}" :key="index"
                     tag="li">
          <img v-lazy="book.bookCover">
          <div>
            <h4>{{book.bookName}}</h4>
            <p>{{book.bookInfo}}</p>
            <b>{{book.bookPrice}}</b>
            <div class="btn-list">
              <button @click.stop="remove(book.bookId)">删除</button>
              <button @click.stop="addCart(book)">添加购物车</button>
            </div>

          </div>
        </router-link>
      </ul>
      <div class="more" @click="more">加载更多</div>
    </div>
  </div>
</template>

<script>
import * as Types from '../store/actions'
import Header from '../base/Header.vue'
import {pagination, removeBook} from '../api'

export default {
  name: 'List',
  data () {
    return {
      books: [],
      offset: 0,
      hasMore: true,
      isLoading: false
    }
  },
  mounted () {
    let scroll = this.$refs.scroll
    let top = scroll.offsetTop
    let distance = 0
    let isMove = false
    scroll.addEventListener('touchstart', (e) => {
      if (scroll.scrollTop !== 0 || scroll.offsetTop !== top) return
      let start = e.touches[0].pageY
      let move = (e) => {
        isMove = true
        let current = e.touches[0].pageY
        distance = current - start
        if (distance > 0) {
          if (distance <= 50) {
            scroll.style.top = distance + top + 'px'
          } else {
            distance = 50
            scroll.style.top = top + 50 + 'px'
          }
        } else {
          scroll.removeEventListener('touchmove', move)
          scroll.removeEventListener('touchend', end)
        }
      }
      let end = (e) => {
        if (!isMove) return
        isMove = false
        clearInterval(this.timer1)
        this.timer1 = setInterval(() => {
          if (distance <= 0) {
            clearInterval(this.timer1)
            distance = 0
            scroll.style.top = top + 'px'
            scroll.removeEventListener('touchmove', move)
            scroll.removeEventListener('touchend', end)
            this.books = []
            this.offset = 0
            this.getData()
            return
          }
          distance -= 1
          scroll.style.top = top + distance + 'px'
        }, 1)
      }
      scroll.addEventListener('touchmove', move)
      scroll.addEventListener('touchend', end)
    }, false)
  },
  created () {
    this.getData()
  },
  methods: {
    addCart (book) {
      this.$store.commit(Types.ADD_CART, book)
    },
    loadMore () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let {scrollTop, clientHeight, scrollHeight} = this.$refs.scroll
        if (scrollTop + clientHeight + 20 > scrollHeight) {
          this.getData()
        }
      }, 30)
    },
    more () {
      this.getData()
    },
    async getData () {
      if (this.hasMore && !this.isLoading) {
        this.isLoading = true
        let {hasMore, books} = await pagination(this.offset)
        this.books = [...this.books, ...books]
        this.hasMore = hasMore
        this.isLoading = false
        this.offset = this.books.length
      }
    },
    async remove (id) {
      await removeBook(id)
      this.books = this.books.filter(item => item.bookId !== id)
    }
  },
  components: {
    Header
  }
}
</script>

<style scoped>
  .content ul {
    padding: 10px;
  }

  .content ul li {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
  }

  .content ul li img {
    width: 35%;
    height: 150px;
  }

  .content ul li div {
    width: 65%;
    margin-left: 10px;
  }

  .content h4 {
    font-size: 20px;
    line-height: 35px;
  }

  .content p {
    color: #2a2a2a;
    line-height: 25px;
  }

  .content b {
    color: red;
  }

  .content button {
    display: block;
    width: 120px;
    height: 25px;
    background: #4867AA;
    color: #fff;
    border: none;
    border-radius: 15px;
    outline: none;
  }

  .more {
    margin: 10px;
    color: #fff;
    background: #4867AA;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 20px;
  }

  .btn-list {
    display: flex;
    justify-content: space-around;

  }
</style>
