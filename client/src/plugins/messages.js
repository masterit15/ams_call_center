export default {
  install(Vue, options){
    Vue.prototype.$message = function(html){
      M.toast({html, classes: "success", displayLength: 5000})
    }
    Vue.prototype.$error = function (html) {
      M.toast({ html: `[Ошибка]: ${html}`, classes: "error", displayLength: 5000 })
    }
  }
}