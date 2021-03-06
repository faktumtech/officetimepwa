import Vue from 'vue'
import Vuex from 'vuex'
import initialStates from './initialStates'
import db from '@/db'
import Utils from '../utils/Utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appVersion: process.env.PACKAGE_VERSION || '0',
    dbVersion: process.env.DEXIEDB_VERSION || 1,
    // persistent properties synced with db
    settings: {
      selectedProjectId: null,
      itemsPerPageSessionTable: null,
      dark: null, // dark theme
      sound: null,
      lastBackupDate: null,
      lastBackupReminderDate: null,
      dbCreationDate: null
    },
    projects: [],
    categories: [],
    // only contains sessions of selectedProjectId
    sessions: [],
    // non-persistent properties
    clipboardApi: false,
    audioApi: false,
    editProjectId: null,
    showModalComponent: null,
    modalDlg: initialStates.modalDlg(),
    alert: initialStates.alert(),
    selectedSessionId: null,
    timerSessionId: null,
    timerStatus: 'stopped',
    timerOffset: 0,
    timerCount: 0
  },
  getters: {
    // syncronous access to vuex
    getSetting: (state) => (key) => {
      return state.settings[key]
    },
    getProject: (state) => (id) => {
      return state.projects.find(project => project.id === id)
    },
    getProjects: (state) => (active) => {
      // exclude archived projects
      if (active) {
        const activeProjects = state.projects.filter((item) => {
          return !item.archived
        })
        return activeProjects.sort((a, b) => {
          return a.title.localeCompare(b.title)
        })
      } else {
        // don't change original array
        // https://stackoverflow.com/questions/9592740/how-can-you-sort-an-array-without-mutating-the-original-array
        return [...state.projects].sort((a, b) => {
          // check first level
          if (a.archived && !b.archived) {
            return 1
          } else if (!a.archived && b.archived) {
            return -1
          } else {
            // check second level
            return a.title.localeCompare(b.title)
          }
        })
      }
    },
    getCategory: (state) => (id) => {
      return state.categories.find(category => category.id === id)
    },
    getSession: (state) => (id) => {
      return state.sessions.find(session => session.id === id)
    },
    projectTitleLookup: (state) => () => {
      const lookup = []
      for (const item of state.projects) {
        lookup[item.id] = item.title
      }
      return lookup
    },
    categoryTitleLookup: (state) => () => {
      const lookup = []
      for (const item of state.categories) {
        lookup[item.id] = item.title
      }
      return lookup
    }

  },
  mutations: {
    updateSetting (state, { key, value }) {
      if (!Object.prototype.hasOwnProperty.call(state.settings, key)) {
        throw new Error('unknown settings property')
      }
      state.settings[key] = value
    },
    clipboardApi (state, value) {
      state.clipboardApi = (value)
    },
    audioApi (state, value) {
      state.audioApi = (value)
    },
    editProjectId (state, value) {
      state.editProjectId = (value)
    },
    showModalComponent (state, value) {
      state.showModalComponent = (value)
    },
    showModalDlg (state, dlg) {
      // reset to initial state each time when shown
      state.modalDlg = initialStates.modalDlg()
      Object.assign(state.modalDlg, dlg, { show: true })
    },
    hideModalDlg (state, dlg) {
      // there is a transition!
      // setting to initial state will show inital data during transition
      state.modalDlg.show = false
    },
    alert (state, dlg) {
      // reset to initial state before showing
      if (!state.alert.show && dlg.show) {
        state.alert = initialStates.alert()
      }
      // Object.assign(state.alert, dlg) doesn't trigger change sometimes
      state.alert = Object.assign({}, state.alert, dlg)
    },

    setProjects (state, value) {
      state.projects = (value)
    },
    createProject (state, project) {
      state.projects.push(project)
    },
    updateProject (state, { id, changes }) {
      const project = state.projects.find(item => item.id === id)
      Object.assign(project, changes)
    },
    deleteProject (state, id) {
      const i = state.projects.findIndex(item => item.id === id)
      state.projects.splice(i, 1)
    },

    setCategories (state, value) {
      state.categories = (value)
    },
    createCategory (state, category) {
      state.categories.push(category)
    },
    updateCategory (state, { id, changes }) {
      const category = state.categories.find(item => item.id === id)
      Object.assign(category, changes)
    },
    deleteCategory (state, id) {
      const i = state.categories.findIndex(item => item.id === id)
      state.categories.splice(i, 1)
    },

    setSessions (state, value) {
      state.sessions = (value)
    },
    createSession (state, session) {
      state.sessions.push(session)
    },
    updateSession (state, { id, changes }) {
      const session = state.sessions.find(item => item.id === id)
      Object.assign(session, changes)
    },
    deleteSession (state, id) {
      const i = state.sessions.findIndex(item => item.id === id)
      state.sessions.splice(i, 1)
    },

    selectedSessionId (state, value) {
      state.selectedSessionId = (value)
    },
    timerSessionId (state, value) {
      state.timerSessionId = (value)
    },
    timerStatus (state, value) {
      state.timerStatus = (value)
    },
    timerCount (state, value) {
      state.timerCount = (value)
    },
    timerOffset (state, value) {
      state.timerOffset = (value)
    }

  },
  actions: {
    /**
     * get persisting settings from db and save to store
     * @return {Promise} undefined
    */
    async initApp (context) {
      try {
        console.log('initApp')
        const selectedProjectId = await db.getSetting('selectedProjectId') || null
        context.commit('updateSetting', { key: 'selectedProjectId', value: selectedProjectId })
        const itemsPerPageSessionTable = await db.getSetting('itemsPerPageSessionTable') || 100
        context.commit('updateSetting', { key: 'itemsPerPageSessionTable', value: itemsPerPageSessionTable })

        let dark = await db.getSetting('dark')
        if (dark === null) {
          // detect color-scheme preference if not hard set in settings
          dark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) || false
        }
        context.commit('updateSetting', { key: 'dark', value: dark })
        const sound = await db.getSetting('sound') || false
        context.commit('updateSetting', { key: 'sound', value: sound })
        let dbCreationDate = await db.getSetting('dbCreationDate')
        if (dbCreationDate === null) {
          dbCreationDate = Date.now()
          await db.updateSetting('dbCreationDate', dbCreationDate)
        }
        context.commit('updateSetting', { key: 'dbCreationDate', value: dbCreationDate })

        const lastBackupDate = await db.getSetting('lastBackupDate')
        context.commit('updateSetting', { key: 'lastBackupDate', value: lastBackupDate })
        const lastBackupReminderDate = await db.getSetting('lastBackupReminderDate')
        context.commit('updateSetting', { key: 'lastBackupReminderDate', value: lastBackupReminderDate })
        const projects = await db.getProjects()
        context.commit('setProjects', projects)
        const categories = await db.getCategories()
        context.commit('setCategories', categories)
      } catch (err) {
        console.error(err)
      }
    },

    /**
     * update setting in db and store
     * @param {Object} payload {key: key; value: value}
     * @return {Promise} undefined
    */
    async updateSetting (context, { key, value }) {
      try {
        await db.updateSetting(key, value)
        context.commit('updateSetting', { key, value })
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * create project and set as selectedProjectId
     * @param {Object} project
     * @return {Promise} id of created project
    */
    async createProject (context, project) {
      const id = await db.createProject(project)
      project.id = id
      context.commit('createProject', project)
      // set selectedProjectId to new project
      await context.dispatch('updateSetting', { key: 'selectedProjectId', value: id })
      return id
    },

    /**
     * update project
     * @param {Object} payload { id, changes }
     * @return {Promise} undefined
    */
    async updateProject (context, { id, changes }) {
      try {
        await db.updateProject(id, changes)
        context.commit('updateProject', { id, changes })
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * delete project and related sessions
     * @param {Number} projectId
     * @return {Promise} undefined
    */
    async deleteProject (context, projectId) {
      try {
        await db.deleteProject(projectId)
        context.commit('deleteProject', projectId)
        // we don't remove sessions from state because after project delete
        // sessions will be reloaded automatically
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * create category
     * @param {Object} category
     * @return {Promise} id of created category
    */
    async createCategory (context, category) {
      const id = await db.createCategory(category)
      category.id = id
      context.commit('createCategory', category)
      return id
    },

    /**
     * update category
     * @param {Object} payload { id, changes }
     * @return {Promise} undefined
    */
    async updateCategory (context, { id, changes }) {
      try {
        await db.updateCategory(id, changes)
        context.commit('updateCategory', { id, changes })
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * delete category
     * @param {Number} categoryId
     * @return {Promise} undefined
    */
    async deleteCategory (context, categoryId) {
      try {
        await db.deleteCategory(categoryId)
        context.commit('deleteCategory', categoryId)
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * get sessions for given projectId
     * @param {Number} projectId
     * @return {Promise} undefined
    */
    async getSessionsByProjectId (context, projectId) {
      try {
        console.log('getSessions')
        const sessions = await db.getSessionsByProjectId(projectId)
        console.log(sessions.length)
        context.commit('setSessions', sessions)
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * create session for given projectId
     * @param {Number} projectId
     * @return {Promise} undefined
    */
    async createSession (context, projectId) {
      try {
        console.log('createSession')
        const defaultCategory = context.getters.getProject(projectId).defaultCategory
        const defaultCategoryRate = context.getters.getCategory(defaultCategory).rate
        const session = {
          p: projectId, // project
          e: false, // expense
          d: Utils.formatDateToLocalDateTimeIsoStr(new Date()).slice(0, -3), // start without seconds
          t: 0, // time
          a: 0, // amount
          c: defaultCategory,
          r: defaultCategoryRate,
          n: ''
        }
        // store in db and get id
        const sessionId = await db.createSession(session)
        session.id = sessionId
        context.commit('createSession', session)
        return sessionId
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * update session
     * @param {Object} payload { id, changes }
     * @return {Promise} id of created project
    */
    async updateSession (context, { id, changes }) {
      try {
        await db.updateSession(id, changes)
        context.commit('updateSession', { id, changes })
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * delete session
     * @param {Number} sessionId
     * @return {Promise} undefined
    */
    async deleteSession (context, sessionId) {
      try {
        await db.deleteSession(sessionId)
        context.commit('deleteSession', sessionId)
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * create expense type session
     * @param {Object} expense
     * @return {Promise} undefined
    */
    async createExpense (context, expense) {
      try {
        console.log('createExpense')
        // store in db and get id
        const sessionId = await db.createSession(expense)
        expense.id = sessionId
        context.commit('createSession', expense)
        return sessionId
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * bulk import sessions (to actualProject)
     * @param {Array} newSessions
     * @return {Promise} undefined
    */
    async importSessions (context, newSessions) {
      try {
        await db.bulkAddSessions(newSessions)
        // get all sessions of project
        const sessions = await db.getSessionsByProjectId(context.state.settings.selectedProjectId)
        console.log(sessions.length)
        context.commit('setSessions', sessions)
      } catch (err) {
        console.log(err)
      }
    },

    /**
     * bulk update rate and calculate new amount for all
     * sessions using a certain category
     * @param {Object} payload { id, rate }
     * @return {Promise} undefined
    */
    async bulkUpdateSessionsRate (context, { id, rate }) {
      try {
        await db.bulkUpdateSessionsRate(id, rate)
        const selectedProjectId = context.getters.getSetting('selectedProjectId')
        await context.dispatch('getSessionsByProjectId', selectedProjectId)
      } catch (err) {
        console.log(err)
      }
    }
  }
})
