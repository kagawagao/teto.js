import CONFIG from 'utils/config'
import REST from 'utils/rest'

export default class extends REST {

  resource = {
    res: CONFIG.LOC_RES,
    api: '/auth'
  };
}
