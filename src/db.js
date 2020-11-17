// src/db.js
import Dexie from 'dexie'

const db = new Dexie('officetimedb')
db.version(1).stores({
  settings: 'k', // k, v
  projects: '++id,defaultCategory', // id, defaultCategory, title
  categories: '++id,title', // id, title, rate
  sessions: '++id,p,d,c' // '++id,p(roject),d(ate),t(ime),c(ategory),n(otes)',
})

db.version(2).stores({
  settings: 'k', // k, v
  projects: '++id,defaultCategory', // id, defaultCategory, title
  categories: '++id,title', // id, title, rate
  sessions: '++id,p,e,d,c' // '++id,p(roject),e(xpense),d(ate),t(ime),a(mount),c(ategory),r(ate),n(otes)',
}).upgrade(async (tx) => {
  const categories = await db.categories.toArray()
  const lookup = []
  for (const item of categories) {
    lookup[item.id] = item.rate
  }

  // Upgrade from version 1 to 2
  return tx.table('sessions').toCollection().modify(session => {
    const rate = lookup[session.c] || 0
    // Modify each session
    session.e = false
    // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    session.a = Math.round(((rate * session.t / 60) + 0.00001) * 100) / 100
    session.r = rate
  })
})

export default {
  /**
   * create a backup
   * @return {Promise} string stringified backup object
  */
  dbBackup: async (dateTimeStr) => {
    const backup = {}
    const appVersion = process.env.PACKAGE_VERSION || '0'
    const dbVersion = process.env.DEXIEDB_VERSION || 1
    backup.settings = await db.settings.toArray()
    backup.projects = await db.projects.toArray()
    backup.categories = await db.categories.toArray()
    backup.sessions = await db.sessions.toArray()
    backup.meta = {
      appVersion: appVersion,
      dbVersion: dbVersion,
      date: dateTimeStr,
      projectsCount: backup.projects.length,
      categoriesCount: backup.categories.length,
      sessionsCount: backup.sessions.length
    }
    return JSON.stringify(backup)
  },

  /**
   * delete all objects from the tables
   * @return {Promise} undefined
  */
  dbErase: async () => {
    await db.settings.clear()
    await db.projects.clear()
    await db.categories.clear()
    await db.sessions.clear()
  },

  /**
   * restore a backup
   * @return {Promise} undefined
  */
  dbRestore: async (backup) => {
    await db.settings.bulkPut(backup.settings)
    await db.projects.bulkPut(backup.projects)
    await db.categories.bulkPut(backup.categories)
    await db.sessions.bulkPut(backup.sessions)
  },

  /**
   * get all settings
   * @return {Promise} Array of settings
  */
  getSettings: () => {
    return db.settings.toArray()
  },

  /**
   * get setting
   * @param {String} key
   * @return {Promise} key value
  */
  getSetting: async (key) => {
    const setting = await db.settings.get({ k: key })
    if (!setting || typeof setting.v === 'undefined') {
      return null
    }
    return setting.v
  },

  /**
   * update project
   * @param {String} key Primary key of record in db
   * @param {any} value
   * @return {Promise} 1 if updated, 0 if not updated (not found / no changes)
  */
  updateSetting: (key, value) => {
    return db.settings.put({ v: value, k: key })
  },

  /**
   * get all projects
   * @return {Promise} Array of projects
  */
  getProjects: () => {
    return db.projects.toArray()
  },

  /**
   * create project
   * @param {Object} project
   * @return {Promise} projectId
  */
  createProject: (project) => {
    return db.projects.add(project)
  },

  /**
   * update project
   * @param {Number} projectId Primary key of record in db
   * @param {Object} changes
   * @return {Promise} 1 if updated, 0 if not updated (not found / no changes)
  */
  updateProject: (projectId, changes) => {
    return db.projects.update(projectId, changes)
  },

  /**
   * delete project and related sessions
   * @param {Number} projectId
   * @return {Promise} undefined
  */
  deleteProject: async (projectId) => {
    // delete all related sessions
    await db.sessions.where({ p: projectId }).delete()
    // delete project
    return db.projects.delete(projectId)
  },

  /**
   * get all categories
   * create first default category if not exists
   * @return {Promise} Array of categories
  */
  getCategories: async () => {
    const categories = await db.categories.toArray()
    // make sure at least one category exists
    if (!categories || categories.length === 0) {
      await db.categories.add({ title: 'No category', rate: 0 })
      return db.categories.toArray()
    }
    return categories
  },

  /**
   * create category
   * @param {Object} category
   * @return {Promise} undefined
  */
  createCategory: (category) => {
    return db.categories.add(category)
  },

  /**
   * update category
   * @param {Number} categoryId Primary key of record in db
   * @param {Object} changes
   * @return {Promise} 1 if updated, 0 if not updated (not found / no changes)
  */
  updateCategory: (categoryId, changes) => {
    return db.projects.update(categoryId, changes)
  },

  /**
   * delete category
   * @param {Number} categoryId Primary key of record in db
   * @param {Number} substituteCategoryId Id of category that will substitute deleted category
   * @return {Promise} undefined
  */
  deleteCategory: async (categoryId, substituteCategoryId) => {
    // update all related sessions
    // pending await db.sessions.where({ p: categoryId }).delete()

    // update all related project defaultCategories
    // pending

    // delete category
    return db.categories.delete(categoryId)
  },

  /**
   * check if category is used in sessions or projects
   * @return {Promise} Boolean
  */
  categoryIdIsUsed: async (categoryId) => {
    return (
      await db.projects.where({ defaultCategory: categoryId }).count() > 0 ||
      await db.sessions.where({ c: categoryId }).count() > 0
    )
  },

  /**
   * get all sessions
   * @return {Promise} Array of sessions
  */
  getSessions: () => {
    return db.sessions.toArray()
  },

  /**
   * get sessions for certain projectId
   * @return {Promise} Array of sessions
  */
  getSessionsByProjectId: (projectId) => {
    return db.sessions.where({ p: projectId }).toArray()
  },

  /**
   * get sessions according query
   * sort has to be done afterwards
   * @param {Object} params
   * {
   *   startDate: startDate,
   *   endDate: endDate,
   *   selectedProjects: selectedProjects, // array of numbers
   *   selectedCategories: selectedCategories // array of strings
   * }
   * @return {Promise} array of sessions
  */
  getSessionsByQuery: (params) => {
    console.log(params)
    if (
      !params.startDate || !params.endDate ||
      !params.selectedProjects || params.selectedProjects.length === 0 ||
      !params.selectedCategories || params.selectedCategories.length === 0
    ) {
      console.log('return empty')
      return []
    }
    const startDate = '' + params.startDate + 'T00:00'
    const endDate = '' + params.endDate + 'T23:59'
    return db.sessions
      .where('d')
      .between(startDate, endDate, true, true)
      .filter(function (session) {
        return (
          params.selectedProjects.includes(session.p) &&
          params.selectedCategories.includes(session.c)
        )
      })
      .toArray()
  },

  /**
   * create session
   * @param {Object} session
   * @return {Promise} sessionId
  */
  createSession: function (session) {
    return db.sessions.add(session)
  },

  /**
   * update session
   * @param {Number} sessionId Primary key of record in db
   * @param {Object} changes
   * @return {Promise} 1 if updated, 0 if not updated (not found / no changes)
  */
  updateSession: (sessionId, changes) => {
    return db.sessions.update(sessionId, changes)
  },

  /**
   * delete session
   * @param {Number} sessionId
   * @return {Promise} undefined
  */
  deleteSession: async (sessionId) => {
    await db.sessions.delete(sessionId)
  },

  /**
   * mock data for session
   * @param {Number} projectId
   * @param {Number} records
   * @return {Promise}
  */
  mockSessions: async (projectId, records) => {
    console.log('mock sessions')
    // create syntetic data
    const sessions = []
    const categories = await db.categories.toArray()
    const projects = await db.projects.toArray()
    const selectedProject = projects.find(project => project.id === projectId)
    const selectedCategory = categories.find(category => category.id === selectedProject.defaultCategory)
    const start = new Date().getTime()
    for (let i = 0; i < records; i++) {
      sessions.push({
        p: projectId,
        d: new Date(start + i * 1000).toISOString().substr(0, 16),
        t: i,
        a: 0,
        c: selectedCategory.id,
        r: selectedProject.rate,
        n: ''
      })
    }
    return db.sessions.bulkPut(sessions)
  }
}
