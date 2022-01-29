import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { QueryClient, QueryClientProvider } from 'react-query'

import './app.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {}
  }
})

class App extends Component {
  onLaunch() {
    if (Taro.getUpdateManager) {
      const updateManager = Taro.getUpdateManager()
      if (updateManager
        && updateManager.onUpdateReady
      ) {
        updateManager.onUpdateReady(() => {
          updateManager.applyUpdate()
        })
      }
    }
  }
  componentDidMount() {
    Taro.cloud.init()
  }

  render() {
    return (
      <QueryClientProvider client={queryClient}>
        {this.props.children}
      </QueryClientProvider>
    )
  }
}

export default App
