import React, { Component } from 'react'
import classNames from 'classnames'
import Link from 'react-router-dom/Link'
import { isMobile, MobileView } from 'react-device-detect'
import ClnIcon from 'images/cln.png'
import MenuIcon from 'images/menu.png'
import ProfileIcon from 'images/profile.png'

class TopNav extends Component {
	state = {
		openMenu: false
	}
	onClickMenu() {
		this.setState({
			openMenu: !this.state.openMenu
		})
	}
	render() {
		let topNavClass = classNames({
			"active": this.props.active,
			"top-navigator": true
		})
		let navLinksClass = classNames({
			"hide": !this.state.openMenu && isMobile,
			"top-nav-links": true
		})

		return <div className={topNavClass}>
			<img src={ClnIcon}/>
			
			<div className={navLinksClass}>
				<a className="top-nav-text">Whitepaper</a>
				<a className="top-nav-text">Q&A</a>
				<Link to="/contact-us">
					<a className="top-nav-text">Contact us</a>
				</Link>
				<div className="top-nav-text">
					<img src="src/images/profile.png"/>
					<span>Disconnected</span>
				</div>
			</div>
			
			<MobileView device={isMobile}>
				<img src={MenuIcon} className="mobile-menu-icon" onClick={this.onClickMenu.bind(this)}/>
			</MobileView>
		</div>
	}
}

export default TopNav
