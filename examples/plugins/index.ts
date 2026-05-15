// @ts-nocheck
import TabsPagePlugin from './tabs-page-plugin'

const Plugins = {
  install: function (app: any) {
    app.use(TabsPagePlugin)
    app.mixin({
      data () {
        return {
          formModel: {}
        }
      }
    })
  }
}
export default Plugins
