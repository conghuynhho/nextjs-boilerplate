const UTM_SOURCE_PARTNER = 0

export const QUERYPARAMS_UTM_SOURCE = 'utm_source'
export const QUERYPARAMS_PR_UTM_SOURCE = 'pr_utm_source'

export const REDIRECT_UTM_SOURCE = 'cutm'
export const REDIRECT_PR_UTM_SOURCE = 'putm'

export const QUERYPARAMS_AUX_TAG = 'auxTag'

export const DEFAULT_KEY = 'ggjMonitor'

const UTM_SOURCE_VALUE_LIFETIME = 60 // days
function addDaysToDate(date, days) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export class UTMStore {

  static _validateAndSelectUTM(newUtm) {
    const arrUTM = Array.isArray(newUtm) ? newUtm : [newUtm]
    // Select first valid utm_source
    for (const valUTM of arrUTM) {
      if (valUTM || valUTM === UTM_SOURCE_PARTNER) { // UTM_SOURCE_PARTNER is currently falsy
        return (typeof valUTM === 'string') ? valUTM.toLowerCase() : valUTM
      }
    }
    return null
  }

  static _resolveDataToUpdate(key = DEFAULT_KEY, newUtm, data) {
    const utm = this._validateAndSelectUTM(newUtm)
    if (utm === null) {
      return null
    }
    const now = Date.now()
    const staleDateFromNow = addDaysToDate(now, -UTM_SOURCE_VALUE_LIFETIME) // now - 60 days: min created at date
    const saveData = {
      key,
      crCreatedAt: +now,
      crUTM: utm,
      prCreatedAt: null,
      prUTM: null,
    }
    if (
      !data || (!data.crUTM && data.crUTM !== UTM_SOURCE_PARTNER)
      || !data.crCreatedAt || data.crCreatedAt < staleDateFromNow // Stale data ==> Do not set previous
    ) {
      return saveData
    }

    const isSameUTM = data.crUTM === utm // Old utm same type new utm ==> Keep old, only update crCreatedAt
    saveData.prCreatedAt = isSameUTM ? data.prCreatedAt : +data.crCreatedAt
    saveData.prUTM = isSameUTM ? data.prUTM : data.crUTM
    return saveData
  }

  static _resolveUTMFromQueryParam(query = {}, targetUtm = QUERYPARAMS_UTM_SOURCE) {
    if (query[QUERYPARAMS_AUX_TAG]) {
      return UTM_SOURCE_PARTNER
    }

    return query[targetUtm]
  }

  /**
       * Store utm_source data associated with productId to browser
       * @param {*} key
       * @param {Object|ParsedUrlQuery} query
       * @returns
       */
  static storeUTM(query = {}, key = DEFAULT_KEY) {
    if (!query || !key) {
      return
    }
    const keyStr = '' + key
    const utmSource = this._resolveUTMFromQueryParam(query)
    const prUtmSource = this._resolveUTMFromQueryParam(query, QUERYPARAMS_PR_UTM_SOURCE)
    if (!utmSource && utmSource !== UTM_SOURCE_PARTNER && prUtmSource !== UTM_SOURCE_PARTNER) {
      return
    }

    let resultData = JSON.parse(localStorage.getItem(key)) || {}
    let dataToUpdate = {}
    if (prUtmSource || prUtmSource === UTM_SOURCE_PARTNER) {
      dataToUpdate = this._resolveDataToUpdate(keyStr, prUtmSource, resultData)
      resultData = dataToUpdate
    }

    if (utmSource || utmSource === UTM_SOURCE_PARTNER) {
      dataToUpdate = this._resolveDataToUpdate(keyStr, utmSource, resultData)
    }

    dataToUpdate && localStorage.setItem(key, JSON.stringify(dataToUpdate))
  }
  /**
       * Get utm_source data associated with productId from browser
       * @param {*} key
       * @returns {Object}
       */
  static getUTM(key = DEFAULT_KEY) {
    let result = {}
    if (!key) {
      return
    }

    const resultData = JSON.parse(localStorage.getItem(key)) || {}

    result = {
      ...resultData,
      // Filter internal store data from resultData
      key: undefined,
    }
    return result
  }

  /**
       * Get utm_source data associated with productId from browser
       * @param {*} key
       * @returns {string}
       */
  static getUTMAsQuery(queryStr = '', key = DEFAULT_KEY) {
    let result = ''
    if (!key) {
      return
    }
    const currentData = JSON.parse(localStorage.getItem(key)) || {}

    // case has utm_source in fullpath
    const query = Object.fromEntries([...new URLSearchParams(queryStr.split('?')[1])])
    const utmSource = this._resolveUTMFromQueryParam(query)
    if (utmSource || utmSource === UTM_SOURCE_PARTNER) {
      const dataToUpdate = this._resolveDataToUpdate(key, utmSource, currentData)
      if (dataToUpdate) {
        result = (dataToUpdate.crUTM || dataToUpdate.crUTM === UTM_SOURCE_PARTNER) ? `${REDIRECT_UTM_SOURCE}=${dataToUpdate.crUTM}` : result
        result = 
          ((dataToUpdate.prUTM || dataToUpdate.prUTM === UTM_SOURCE_PARTNER)
            && dataToUpdate.prCreatedAt > addDaysToDate(Date.now(), -UTM_SOURCE_VALUE_LIFETIME)) 
            ? `${result ? result + '&' : ''}${REDIRECT_PR_UTM_SOURCE}=${dataToUpdate.prUTM}` 
            : result  
      }
      return result
    }

    if (currentData) {
      result = ((currentData.crUTM || currentData.crUTM === UTM_SOURCE_PARTNER)
                && currentData.crCreatedAt > addDaysToDate(Date.now(), -UTM_SOURCE_VALUE_LIFETIME)) 
        ? `${REDIRECT_UTM_SOURCE}=${currentData.crUTM}` 
        : result
      result = ((currentData.prUTM || currentData.prUTM === UTM_SOURCE_PARTNER) 
                && currentData.prCreatedAt > addDaysToDate(Date.now(), -UTM_SOURCE_VALUE_LIFETIME)) 
        ? `${result ? result + '&' : ''}${REDIRECT_PR_UTM_SOURCE}=${currentData.prUTM}` 
        : result
    }
    return result
  }
}
