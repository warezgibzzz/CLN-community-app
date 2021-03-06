import React, { Component } from 'react'
import classNames from 'classnames'
import { withFormik } from 'formik'
import { isMobile } from 'react-device-detect'
import Yup from 'yup'
import * as uiActions from 'actions/ui'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classnames from 'classnames'
import {subcribeToMailingList} from 'services/api'
import CloseButton from 'images/x.png'
import MobileSubmit from 'images/mobile-submit.png'
import ReactGA from 'services/ga'

const InputFeedback = ({ error }) => error ? (<div className="input-feedback">{error}</div>) : null

const TextInput = ({
	type,
	id,
	error,
	value,
	onChange,
	className,
	...props
}) => {
	const classes = classnames(
		'contact-field-wrapper',
		{
			'animated shake error': !!error,
		},
		className
	)
	let field = <input
					id={id}
					className="text-input"
					type={type}
					value={value}
					onChange={onChange}
					{...props}/>

	return (
		<div className={classes}>
			{field}
		</div>
	)
}

const SignUp = props => {
	const {
		values,
		touched,
		errors,
		dirty,
		isSubmitting,
		isValid,
		setFieldValue,
		handleChange,
		handleBlur,
		handleSubmit,
		close,
		status,
		closed,
		handleReset,
	} = props

	const formContent = <form onSubmit={handleSubmit}>
				<TextInput
				  id="email"
				  type="email"
				  label="EMAIL *"
				  autoComplete="off"
				  placeholder={isMobile ? "Get CLN Updates (enter email)" : "Enter your email"}
				  error={touched.email && errors.email}
				  value={values.email}
				  onChange={handleChange}
				  onBlur={handleBlur}
				/>

				<button type="submit" disabled={!isValid}>
					{isMobile ? <img className="mobile-submit" src={MobileSubmit}/> : 'Submit'}
				</button>
			</form>
	return (
		<div style={{width: isMobile ? 'calc(100% - 16px)' : 'auto'}}>
		{formContent}
		</div>
	)
}

const SignUpForm = withFormik({
	mapPropsToValues: () => ({ email: '' }),
	validationSchema: Yup.object().shape({
		email: Yup.string()
			.email('Invalid email address')
			.required('')
	}),
	handleSubmit: (values, props) => {
		props.setSubmitting(false)
		subcribeToMailingList(values)
		props.resetForm()
		localStorage.setItem("signup", true)
		ReactGA.event({
			category: 'Subscription',
			action: 'Click',
			label: 'Subscribe'
		})
	},
	displayName: 'SignUpForm', // helps with React DevTools
})(SignUp)

class SignUpFormBar extends Component {
	state = {
		closed: false,
		signupDone: localStorage.getItem("signup")
	}
	close = () => {
		this.setState({ closed: true })
		this.props.uiActions.closeSignup(true)
		ReactGA.event({
			category: 'Subscription',
			action: 'Click',
			label: 'Close'
		})
	}
	render() {
		const wrapperClass = classnames({
			'sign-up-wrapper': true,
			'closed': this.state.closed
		})

		return (
			<div className={wrapperClass}>
				<div className="sign-up-container">
					{isMobile ? null : <p>Get CLN Updates</p>}
					<SignUpForm closeMe={this.close}/>
					<div className="sidebar-close" onClick={this.close}>
						<img src={CloseButton}/>
					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
    return {
        uiActions: bindActionCreators(uiActions, dispatch),
    }
}
export default connect(null, mapDispatchToProps)(SignUpFormBar)
