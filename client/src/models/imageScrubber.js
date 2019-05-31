import Axios from 'axios'
import { API_ROOT } from '../common/variables.js'

const imageScrubber = {
  state: {
    data: [],
    numSelected: 0,
    page: 0,
    rowsPerPage: 9999,
    order: 'asc',
    orderBy: 'timeUpdated',
    selected: [],
    actionNav: {
      'isOpen': false
    }
  },
  reducers: {
    getTree (state, tree) {
      return { ...state, tree }
    },
    getTrees (state, payload, { page, rowsPerPage, order, orderBy }) {
      return { ...state, data: payload, page: page, rowsPerPage: rowsPerPage, order: order, orderBy: orderBy }
    },
    toggleSelection (state, payload) {
      const idIsInArray = state.selected.find(el => {
        return el === payload.id
      })
      const newSelected = state.selected.slice()
      if (idIsInArray === payload.id) {
        const index = newSelected.indexOf(payload.id)
        newSelected.splice(index, 1)
        return { ...state, selected: newSelected }
      } else {
        newSelected.unshift(payload.id)
        return { ...state, selected: newSelected }
      }
    },
    addToSelection (state, payload, { id }) {
      console.log('addToSelection')
    },
    removeFromSelection (state, payload, { id }) {
      console.log('removeFromSelection')
    },
    receiveLocation (state, payload, { id, address }) {
      if (address === 'cached') {
        return state
      } else {
        const byId = Object.assign({}, state.byId)
        if (byId[id] == null) byId[id] = {}
        byId[id].location = payload.address
        return { ...state, byId }
      }
    },
    receiveStatus (state, payload) {
      /**
       NOTE: May need to get access to tree store to get the tree to update in the TreeTable - 03/31/19
       // let i = state.trees.data.indexOf(payload)
       // state.trees.data[i].active = payload.active
       // return { ...state }
      **/
      return { ...state, payload }
    },
    toggleActions (state) {
      return { actionNav: { isOpen: !state.isOpen } }
    },
    openActions (state) {
      return { actionNav: { isOpen: true } }
    },
    closeActions (state) {
      return { actionNav: { isOpen: false } }
    }
  },
  effects: {
    async getTreesWithImagesAsync ({ page, rowsPerPage, orderBy = 'id', order = 'asc' }) {
      const query = `${API_ROOT}/trees?filter[order]=${orderBy} ${order}&filter[limit]=${rowsPerPage}&filter[skip]=${page * rowsPerPage}&filter[fields][imageUrl]=true&filter[fields][lat]=true&filter[fields][lon]=true&filter[fields][id]=true&filter[fields][timeCreated]=true&filter[fields][timeUpdated]=true&filter[where][active]=true&field[imageURL]`
      Axios.get(query)
        .then((response) => {
          this.getTrees(response.data, { page: page, rowsPerPage: rowsPerPage, orderBy: orderBy, order: order })
        })
    },
    async getLocationName (payload, rootState) {
      if ((rootState.trees.byId[payload.id] &&
        rootState.trees.byId[payload.id].location &&
        rootState.trees.byId[payload.id].location.lat !== payload.lat &&
        rootState.trees.byId[payload.id].location.lon !== payload.lon) ||
        (
          !rootState.trees.byId[payload.id] || !rootState.trees.byId[payload.id].location
        )) {
        const query = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${payload.latitude}&lon=${payload.longitude}`
        Axios.get(query)
          .then((response) => {
            this.receiveLocation(response.data, payload)
          })
      } else {
        this.receiveLocation(null, { id: payload.id, address: 'cached' })
      }
    },
    async toggleTreeActive (id, isActive) {
      const query = `${API_ROOT}/trees/${id}/`
      const data = { 'active': isActive }
      Axios.patch(query, data)
        .then((res) => {
          if (res.status === 200) {
            this.receiveStatus(res.data)
          }
        })
        .catch(err => console.error(`ERROR: FAILED TO RETRIEVE STATUS ${err}`))
    }
  }
}

export default imageScrubber
