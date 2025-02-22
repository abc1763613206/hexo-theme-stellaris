'use strict'

hexo.extend.helper.register('stellar_info', function (args) {
  const repo = 'https://github.com/abc1763613206/hexo-theme-stellaris'
  const wiki = 'https://xaoxuu.com/wiki/stellar/'
  const issues = repo + '/issues/'
  const { version } = require('../../package.json')
  const cfg = hexo.theme.config.stellar
  if (!args) {
    return repo
  } else if (args == 'name') {
    return 'Stellaris'
  } else if (args == 'version') {
    return version
  } else if (args == 'issues') {
    return repo + '/issues/'
  } else if (args == 'tree') {
    return repo + '/tree/' + version
  }
  return ''
})
