import React, {Component} from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, withProps, withStateHandlers, withState, withHandlers } from "recompose"
import { mapStyle, googleMapsUrl } from '../constants/uiConstants'
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	OverlayView
} from "react-google-maps"
import classNames from 'classnames'

import addresses from '../constants/addresses'
import Marker from 'components/Marker'
import * as uiActions from '../actions/ui'

const panByHorizontalOffset = 1.4 // because of the community sidebar, so it's a bit off the center

const getPixelPositionOffset = (width, height) => ({
	x: -(width / 2),
	y: -(height / 2),
})

const GoogleMapComponent = compose(
	withProps({
		googleMapURL: googleMapsUrl,
		loadingElement: <div style={{ height: `100%`, backgroundColor: 'rgb(36, 35, 52)' }} />,
		containerElement: <div style={{ width: `100%`,  height: `100vh`, backgroundColor: 'rgb(36, 35, 52)'  }} />,
		mapElement: <div className="map-element" style={{ height: `100%`, backgroundColor: 'rgb(36, 35, 52)' }} />
	}),
	withScriptjs,
	withGoogleMap,
	withState('zoom', 'zoomIn', 4),
	withHandlers(() => {
		const refs = {map: undefined}

		return {
			onMapMounted: () => ref => {
				refs.map = ref
			},
			onClick: ({zoomIn}) => (location, coinAddress, uiActions) => {
				let n = 5
				refs.map.panTo({lat: parseFloat(location.lat), lng: parseFloat(location.lng) + panByHorizontalOffset})
				//zoomIn(n)
				uiActions.zoomToMarker(n)
				setTimeout(() => {uiActions.zoomToMarker(n + 1)}, 150)
				setTimeout(() => {uiActions.zoomToMarker(n + 2)}, 300)
				setTimeout(() => {uiActions.zoomToMarker(n + 3)}, 450)
				
				uiActions.setActiveMarker(coinAddress)
			}
		}
	})
)(props => (
	<GoogleMap
		defaultZoom={4}
		defaultCenter={{ lat:34.0507729, lng: 32.75446020000004}}
		defaultOptions={{styles: mapStyle, disableDefaultUI: true}}
		ref={props.onMapMounted}
		style={{backgroundColor: 'rgb(229, 227, 223)'}}
		zoom={props.ui.zoom || 4}>

		{ props.tokens && props.tokens[addresses.TelAvivCoinAddress] && props.tokens[addresses.TelAvivCoinAddress].metadata &&
			<OverlayView position={props.tokens[addresses.TelAvivCoinAddress].metadata.location} 
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.TelAvivCoinAddress}
					community={{name: props.tokens[addresses.TelAvivCoinAddress].name, price: '0.9CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.TelAvivCoinAddress].metadata.location, addresses.TelAvivCoinAddress,  props.uiActions)}/>
			</OverlayView>
		}

		<OverlayView position={{ lat: 32.7940, lng: 34.9895 }} 
			mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
			<Marker community={{name: 'Haifa Coin', price: '0.8CLN'}} id={'placeholder'}/>
		</OverlayView>

		{ props.tokens && props.tokens[addresses.LondonCoinAddress] && props.tokens[addresses.LondonCoinAddress].metadata &&
			<OverlayView position={props.tokens[addresses.LondonCoinAddress].metadata.location} 
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.LondonCoinAddress}
					community={{name: props.tokens[addresses.LondonCoinAddress].name, price: '0.7CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.LondonCoinAddress].metadata.location, addresses.LondonCoinAddress, props.uiActions)}/>
			</OverlayView>
		}

		<OverlayView position={{ lat: 53.4083, lng: -2.9915 }} 
			mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
			<Marker community={{name: 'Liverpool Coin', price: '0.6CLN'}} id={'placeholder'}/>
		</OverlayView>
	</GoogleMap>
));

class MapComponent extends Component {
	//onClick() {
	//	//console.log("click props", props.googleMapURL)
	//	//let n = 5
	//	refs.map.panTo({lat: 32.0852, lng: 34.7817 + panByHorizontalOffset})
	//	//zoomIn(n)
	//	//setTimeout(() => {zoomIn(n + 1)}, 150)
	//	//setTimeout(() => {zoomIn(n + 2)}, 300)
	//	//setTimeout(() => {zoomIn(n + 3)}, 450)
	//}
	render() {
		//console.log("zoom PROPS", this.props.ui && this.props.ui.zoom)
		let mapWrapperClass = classNames({
			"active": this.props.active,
			"map-wrapper": true
		})

		return (
			<div className={mapWrapperClass} >
				<GoogleMapComponent tokens={this.props.tokens} ui={this.props.ui} uiActions={this.props.uiActions}/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		tokens: state.tokens,
		ui: state.ui
	}
}

const mapDispatchToProps = dispatch => {
    return {
        uiActions: bindActionCreators(uiActions, dispatch),
    }
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapComponent)