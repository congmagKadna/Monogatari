import { Action } from '../Action';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

export class Message extends Action {

	static configuration (object = null) {
		if (object !== null) {
			if (typeof object === 'string') {
				return Message._configuration[object];
			} else {
				Message._configuration = Object.assign ({}, Message._configuration, object);
			}
		} else {
			return Message._configuration;
		}
	}

	static setup (selector) {
		$_(`${selector} #game #components`).append (`
			<div data-component="modal" data-ui="messages" class="middle">
				<div data-ui="message-content"></div>
				<div class="horizontal horizontal--center" data-ui="inner-menu">
					<button data-action="close" data-close="messages" data-string="Close">Close</button>
				</div>
			</div>
		`);
		return Promise.resolve ();
	}

	static reset () {
		$_(`${Monogatari.selector} [data-ui="messages"]`).removeClass ('active');
		return Promise.resolve ();
	}

	static canProceed () {
		if ($_(`${Monogatari.selector} [data-ui="messages"]`).isVisible ()) {
			return Promise.reject ();
		}
		return Promise.resolve ();
	}

	static canRevert () {
		if ($_(`${Monogatari.selector} [data-ui="messages"]`).isVisible ()) {
			$_(`${Monogatari.selector} [data-ui="messages"]`).removeClass ('active');
			$_(`${Monogatari.selector} [data-ui="message-content"]`).html ('');
			Monogatari.global ('block', false);
		}
		return Promise.resolve ();
	}

	static matchString ([ show, type ]) {
		return show === 'show' && type === 'message';
	}

	static messages (object = null) {
		if (object !== null) {
			if (typeof object === 'string') {
				return Message._configuration.messages[object];
			} else {
				Message._configuration.messages = Object.assign ({}, Message._configuration.messages, object);
			}
		} else {
			return Message._configuration.messages;
		}
	}

	constructor ([ show, type, message ]) {
		super ();
		this.message = Message.messages (message);
	}

	willApply () {
		if (typeof this.message !== 'undefined') {
			return Promise.resolve ();
		}
		return Promise.reject ();
	}

	apply () {
		$_(`${Monogatari.selector} [data-ui="message-content"]`).html (`
			<h3>${this.message.Title}</h3>
			<p>${this.message.Subtitle}</p>
			<p>${this.message.Message}</p>
		`);
		$_(`${Monogatari.selector} [data-ui="messages"]`).addClass ('active');
		return Promise.resolve ();
	}

	revert () {
		$_(`${Monogatari.selector} [data-ui="message-content"]`).html ('');
		$_(`${Monogatari.selector} [data-ui="messages"]`).removeClass ('active');
		return Promise.resolve ();
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

Message.id = 'Message';
Message._configuration = {
	messages: {}
};

Monogatari.registerAction (Message);