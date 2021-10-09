
Mess.ipcRenderer.once(Mess.event.lifetime.pluginEnter, (e, message) => {
  console.log(22222)
  new Notification("11111")
})


Mess.ipcRenderer.once(Mess.event.lifetime.pluginLoadingEnd, (e, message) => {
  console.log(3333)
})

Mess.ipcRenderer.once(Mess.event.lifetime.PluginExit, (e, message) => {
  console.log(4444)
  new Notification("tuichu")
})