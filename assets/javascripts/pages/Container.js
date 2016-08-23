import React, { Component } from 'react'
import AuthService from '../utils/AuthService'
import Navigation from '../presentations/Navigation'
import Sidebar from '../presentations/Sidebar'
import Footer from '../presentations/Footer'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'
//import lang from '../components/lang'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


export default class Container extends Component {

  render() {
    let children = null
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance from route to children
      })
      console.log(this.props)
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
      {/* <IntlProvider locale={lang.locale} messages={lang.messages}> */}
        <div>
          <Navigation auth={this.props.route.auth} />
          <div>
            { children }
          </div>
          <Footer />
        </div>
      {/* </IntlProvider> */}
      </MuiThemeProvider>
    )
  }

}
