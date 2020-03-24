const fs = require('fs')
const PATH = "./data.json";

class Post {
    get(){
      return this.readData()
    }

    getIndividualBlog(postId){
      const posts = this.readData()
      const foundPost = posts.find((post) => post.id == postId)
      return foundPost
    }

    readData(){
      let rawdata = fs.readFileSync(PATH)
      let posts = JSON.parse(rawdata)
      return posts
    }

    add(rawdata){
      const currentPosts = this.readData()
      currentPosts.unshift(rawdata)
      this.storeData(currentPosts)
    }

    storeData(rawdata){
      let data = JSON.stringify(rawdata)
      fs.writeFileSync(PATH, data)
    }
}

module.exports = Post
