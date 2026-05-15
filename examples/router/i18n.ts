type LocaleTree = {
  [key: string]: LocaleTree | { name: string }
}

const routerI18n: { messages: Record<string, LocaleTree> } = {
  messages: {
    CN: {
      home: { name: '首页' }
    },
    US: {
      home: { name: 'home' }
    },
    HK: {
      home: { name: '首頁' },
      dashboard: {
        name: 'Dashboard',
        workplace: { name: '工作台' },
        analysis: { name: '分析頁' }
      },
      exception: {
        name: '異常頁',
        404: { name: '404' },
        403: { name: '403' },
        500: { name: '500' }
      },
      components: {
        name: '小組件',
        taskCard: { name: '任務卡片' },
        palette: { name: '顏色複選框' }
      }
    }
  }
}

export default routerI18n
