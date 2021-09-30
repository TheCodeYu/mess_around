
Mess.ipcRenderer.once(Mess.event.lifetime.pluginEnter, (e, message) => {
  console.log(22222)
})


Mess.ipcRenderer.once(Mess.event.lifetime.pluginLoadingEnd, (e, message) => {
  console.log(3333)
})

Mess.ipcRenderer.once(Mess.event.lifetime.PluginExit, (e, message) => {
  console.log(4444)
})