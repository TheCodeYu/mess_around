
mess.ipcRenderer.once(mess.event.lifetime.pluginEnter, (e, message) => {
  console.log(22222)
  new Notification("11111")
})


mess.ipcRenderer.once(mess.event.lifetime.pluginLoadingEnd, (e, message) => {
  console.log(3333)
})

mess.ipcRenderer.once(mess.event.lifetime.PluginExit, (e, message) => {
  console.log(4444)
  new Notification("tuichu")
})