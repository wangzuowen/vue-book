<template>
  <div>
    <Header>添加</Header>
    <div class="content">
      <ul>
        <li>
          <label for="bookName">书的名称</label>
          <input type="text" v-model="book.bookName" id="bookName">
        </li>
        <li>
          <label for="bookInfo">书的信息</label>
          <input type="text" v-model="book.bookInfo" id="bookInfo">
        </li>
        <li>
          <label for="bookPrice">书的价格</label>
          <input type="text" v-model.number="book.bookPrice" id="bookPrice">
        </li>
        <li>
          <label for="bookCover">书的封面</label>
          <input type="text" v-model="book.bookCover" id="bookCover">
        </li>
        <li>
          <button @click="add">添加</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from '../base/Header.vue'
import {addBook} from '../api'

export default {
  name: 'Add',
  data () {
    return {
      book: {}
    }
  },
  methods: {
    async add () {
      await addBook(this.book)
      this.$router.push('/list')
    }
  },
  components: {
    Header
  }
}
</script>

<style scoped lang="less">
  ul {
    margin: 50px 20px 0 20px;
  }
  li {
    label {
      display: block;
      font-size: 25px;
    }
    input {
      margin: 10px 0;
      height: 25px;
      width: 100%;
    }
    button {
      display: block;
      width: 80px;
      height: 35px;
      background: #4867AA;
      color: #fff;
      border: none;
      border-radius: 4px;
      outline: none;
    }
  }
</style>
