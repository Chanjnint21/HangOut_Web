import axios from 'axios'
import VueCookie from 'vue-cookie';

const realTimeDB = 'https://outdoor-traveler-default-rtdb.firebaseio.com/'

export const Service = {
  convertLists (unConvertList) {
    const convertList = []
    for (const listId in unConvertList) {
      unConvertList[listId].id = listId
      convertList.push(unConvertList[listId])
    }
    return convertList
  },
  async crrUserData () {
    try {
      const uid = VueCookie.get('session')
      const users = await axios.get(`${realTimeDB}users.json?&orderBy="tokenId"&equalTo="${uid}"`)
      var crrUser = {}
      const response = users.data;
      for (const userId in response) {
        response[userId].id = userId
        crrUser = { ...response[userId] }
        break
      }
      return crrUser
    } catch (e) {
      console.log(e)
    }
  },

  //--------------------------------------------------------------------about user--------------------------------------------------------------
  async AuthUser(uid, name) {
    await axios.patch(`${realTimeDB}users.json?&orderBy="name"&equalTo="${name}"`, { 'tokenId' : uid})
  },
  async allUsers () {
    const userData = await axios.get(`${realTimeDB}users.json`)
    const response = userData.data;
    return this.convertLists(response)
  },
  async Register (userData) {
    try {
      const users = await axios.post(`${realTimeDB}users.json`, userData)
      return users.data
    } catch (e) {
      console.log(e)
    }
  },
  async updateUser (id, pfInfo) {
    try {
      return await axios.patch(`${realTimeDB}users/${id}.json`, pfInfo)
    } catch (e) {
      console.log(e)
    }
  },
  async getUser (id) {
    try {
      const users = await axios.get(`${realTimeDB}users/${id}.json`)
      return users.data
    } catch (e) {
      console.log(e)
    }
  },
  async handleSearchUser (q) {
    if (q === '' || q === ' ') return this.getUser()
    try {
      const searchData = await axios.get(`${realTimeDB}users.json?&orderBy="name"&equalTo="${q}"`)
      var crrUser
      const response = searchData.data;
      for (const userId in response) {
        response[userId].id = userId
        crrUser = { ...response[userId] }
      }
      return crrUser
    } catch (e) {
      console.log(e)
    }
  },

  //-------------------------------------------------------------------------------about follow-------------------------------------------------------
  async follow (followData) {
    try {
      await axios.post(`${realTimeDB}Follow.json`, followData)
    } catch (e) {
      console.log(e)
    }
  },
  async unfollow (followId) {
    try {
      await axios.delete(`${realTimeDB}Follow/${followId}.json`)
    } catch (e) {
      console.log(e)
    }
  },
  async getFollow (crrUser, pfUser) {
    try {
      const followData = await axios.get(`${realTimeDB}Follow.json?orderBy="user_id"&equalTo="${crrUser}"`)
      const followLists = this.convertLists(followData.data)
      for (let i = 0; i < followLists.length; i++) {
        if (followLists[i].following === pfUser) {
          return followLists[i]
        }
      }
      return false
    } catch (e) {
      console.log(e)
    }
  },
  async followingList (crrUser) {
    try {
      const followingData = await axios.get(`${realTimeDB}Follow.json?orderBy="user_id"&equalTo="${crrUser}"`)
      return this.convertLists(followingData.data)
    } catch (e) {
      console.log(e)
    }
  },
  async followerList (crrUser) {
    try {
      const followerData = await axios.get(`${realTimeDB}Follow.json?orderBy="following"&equalTo="${crrUser}"`)
      return this.convertLists(followerData.data)
    } catch (e) {
      console.log(e)
    }
  }
}
