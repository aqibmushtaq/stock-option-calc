config = {
  local: {
    mode: 'local',
    port: 3000,
    logLevel: 'trace'
  },
  staging: {
    mode: 'staging',
    port: 4000,
    logLevel: 'info' 
  },
  production: {
    mode: 'production',
    port: 5000,
    logLevel: 'warn'
  }
}
module.exports = function(mode) {
  return config[mode || process.argv[2] || 'local'] || config.local;
}
