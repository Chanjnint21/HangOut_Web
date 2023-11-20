import axios from 'axios'
import { Service } from '@/service/index.js'

const realTimeDB = 'https://outdoor-traveler-default-rtdb.firebaseio.com/'
export const C_Service = {
	convertLists (unConvertList) {
		const convertList = []
		for (const listId in unConvertList) {
			unConvertList[listId].id = listId
			convertList.push(unConvertList[listId])
		}
		return convertList
	},
	async getList () {
		const dataList = await axios.get(`${realTimeDB}trips.json`)
		const tripList = dataList.data
		return this.convertLists(tripList)
	},
	async newTripCard (card) {
		await axios.post(`${realTimeDB}trips.json`, card)
	},

	//------------------------------------------------------Drafting function-------------------------------------------------------------
	async draftCard (card) {
		await axios.post(`${realTimeDB}drafts.json`, card)
	},
	async getAllDrafts (id) {
		try {
			const cardData = await axios.get(`${realTimeDB}drafts.json?orderBy="author/id"&equalTo="${id}"`)
			return this.convertLists(cardData.data)
		} catch (e) {
			console.log(e)
		}
	},
	async thisDraftId (id) {
		const Data = await axios.get(`${realTimeDB}drafts/${id}.json`)
		const response = Data.data
		response.id = id
		return response
	},
	async updateDraft (id, cardInfo) {
		return axios.patch(`${realTimeDB}drafts/${id}.json`, cardInfo)
	},
	async deleteDraft (id) {
		return axios.delete(`${realTimeDB}drafts/${id}.json`)
	},
	async handleSearchDraft (q) {
		if (q === " " || q === "") return this.getAllDrafts()
		const searchData = await axios.get(`${realTimeDB}drafts.json?&orderBy="title"&equalTo="${q}"`)
		const draftList = searchData.data
		return this.convertLists(draftList)
	},
	async thisUserCard (id) {
		const tripData = await axios.get(`${realTimeDB}trips.json?&orderBy="author/id"&equalTo="${id}"`)
		const tripList = tripData.data
		return this.convertLists(tripList)
	},
	async getCardById (cardId) {
		try {
			const cardData = await axios.get(`${realTimeDB}trips/${cardId}.json`)
			return cardData.data
		} catch (e) {
			console.log(e)
		}
	},
	async handleSearchQuery (q) {
		if (q === " " || q === "") return this.getList()
		const searchData = await axios.get(`${realTimeDB}trips.json?&orderBy="title"&equalTo="${q}"`)
		const tripList = searchData.data
		return this.convertLists(tripList)
	},
	async deleteItem (id) {
		try {
			await axios.delete(`${realTimeDB}trips/${id}.json`)
			const IfRegister = await axios.get(`${realTimeDB}RegisterTrip.json?orderBy="card_id"&equalTo="${id}"`)
			const IfRegResponse = this.convertLists(IfRegister.data)
			for (let i = 0; i < IfRegResponse.length; i++) {
				this.unRegister(IfRegResponse[i].id)
			}
			const IfFavorite = await axios.get(`${realTimeDB}Favorite.json?orderBy="card_id"&equalTo="${id}"`)
			const IfFavResponse = this.convertLists(IfFavorite.data)
			console.log(IfFavResponse)
			for (let i = 0; i < IfFavResponse.length; i++) {
				await axios.delete(`${realTimeDB}Favorite/${IfFavResponse[i].id}.json`)
			}
		} catch (error) {
			console.log(error)
		}
	},
	async thisIdData (id) {
		const Data = await axios.get(`${realTimeDB}trips/${id}.json`)
		const response = Data.data
		response.id = id
		return response
	},
	// update the entire card
	async UpdateCard (id, cardInfo) {
		return axios.put(`${realTimeDB}trips/${id}.json`, cardInfo)
	},
	// only update card
	async UpdateCardImg (id, imgs) {
		return axios.patch(`${realTimeDB}trips/${id}.json`, imgs)
	},
	//------------------------------------------------------------------------Sorting function------------------------------------------------------------------------
	async sorting (val) {
		const SortData = await axios.get(`${realTimeDB}trips.json`);
		const sorting = this.convertLists(SortData.data)
		if (val === 'Price to High') {
			for (let i = 0; i < sorting.length - 1; i++) {
				for (let j = 0; j < sorting.length - i - 1; j++) {
					if (parseFloat(sorting[j].requirement.cost) > parseFloat(sorting[j + 1].requirement.cost)) {
						const temp = sorting[j]
						sorting[j] = sorting[j + 1]
						sorting[j + 1] = temp
					}
				}
			}
		} else if (val === 'Price to Low') {
			for (let i = 0; i < sorting.length - 1; i++) {
				for (let j = 0; j < sorting.length - i - 1; j++) {
					if (parseFloat(sorting[j].requirement.cost) < parseFloat(sorting[j + 1].requirement.cost)) {
						const temp = sorting[j]
						sorting[j] = sorting[j + 1]
						sorting[j + 1] = temp
					}
				}
			}
		} else if (val === 'newest') {
			sorting.sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
		} else if (val === 'oldest') {
			sorting.sort((a, b) => new Date(a.postDate) - new Date(b.postDate))
		} else if (val === 'User') {
				const userList = await Service.allUsers()
			return userList
		}
		return sorting
	},
	//------------------------------------------------------------------------related to register the card------------------------------------------------------------
	async submitRegister (subForm) {
		await axios.post(`${realTimeDB}RegisterTrip.json`, subForm)
	},
	async getRegister (uId, cId) {
		try {
			const regData = await axios.get(`${realTimeDB}RegisterTrip.json?orderBy="user_id"&equalTo="${uId}"`)
			const UserReg = this.convertLists(regData.data)
			for (let i = 0; i < UserReg.length; i++) {
				if (UserReg[i].card_id === cId) {
					return UserReg[i]
				}
			}
			return false
		} catch (e) {
			console.log(e)
		}
	},
	async unRegister (id) {
		await axios.delete(`${realTimeDB}RegisterTrip/${id}.json`)
	},
	async showRegister (uId) {
		try {
			const regData = await axios.get(`${realTimeDB}RegisterTrip.json?orderBy="user_id"&equalTo="${uId}"`)
			return this.convertLists(regData.data)
		} catch (e) {
			console.log(e)
		}
	},
	//--------------------------------------------------------------------------related to favorite------------------------------------------------------------
	async thisUserFav (UserId) {
		const FavData = await axios.get(`${realTimeDB}Favorite.json?orderBy="user_id"&equalTo="${UserId}"`)
		const response = FavData.data
		return this.convertLists(response)
	},
	async getFav (uId, itemId) {
		try {
			const FavUData = await axios.get(`${realTimeDB}Favorite.json?orderBy="user_id"&equalTo="${uId}"`)
			const UserFav = this.convertLists(FavUData.data)
			for (let i = 0; i < UserFav.length; i++) {
				if (UserFav[i].card_id === itemId) {
					return UserFav[i]
				}
			}
			return false
		} catch (e) {
			console.log(e)
		}
	},
	async addFav (uId, cardId) {
		try {
			await axios.post(`${realTimeDB}Favorite.json`, {
				user_id: uId,
				card_id: cardId
			})
		} catch (e) {
			console.log(e)
		}
	},
	async removeFav (uId, cardId) {
		try {
			const thisFav = await this.getFav(uId, cardId)
			await axios.delete(`${realTimeDB}Favorite/${thisFav.id}.json`)
		} catch (e) {
			console.log(e)
		}
	},
      //---------------------------------------------------------------------------about expire card --------------------------------------------------------------------
  async pastTripCard (card) {
    await axios.post(`${realTimeDB}joined.json`, card)
  },
  async expiryCard (id) {
    try {
      await axios.patch(`${realTimeDB}trips/${id}.json`, { expiry: true })
    } catch (e) {
      console.log(e)
    }
  },
  async registeredCard (id) {
    try {
      const regMatch = await axios.get(`${realTimeDB}RegisterTrip.json?orderBy="card_id"&equalTo="${id}"`)
      return this.convertLists(regMatch.data)
    } catch (e) {
      console.log(e)
    }
  },
  async getExpCard () {
    try {
      const expCard = await axios.get(`${realTimeDB}trips.json?&orderBy="expiry"&equalTo=true`)
      return this.convertLists(expCard.data)
    } catch (e) {
      console.log(e)
    }
  },
	async getParticipator (tripId) {
    try {
      const partData = await axios.get(`${realTimeDB}RegisterTrip.json?orderBy="card_id"&equalTo="${tripId}"`)
      return this.convertLists(partData.data)
    } catch (e) {
      console.log(e)
    }
  },
}
