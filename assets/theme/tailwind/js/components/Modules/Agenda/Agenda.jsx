import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import "moment/locale/fr";

import frLocale from '@fullcalendar/core/locales/fr';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import Formulaire from "@commonFunctions/formulaire";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

import { InventoryDetails } from "@userPages/Inventories/InventoryDetails";
import { InventoryFormulaire } from "@userPages/Inventories/InventoryForm";

const URL_INDEX_ELEMENTS = "user_inventories_index";
const URL_GET_DATA = "intern_api_agenda_events_list";
const URL_UPDATE_ELEMENT = "admin_agenda_update";
const URL_GET_DATA_FOKUS = "intern_api_fokus_inventories_list";
const URL_MOVE_ELEMENT = "intern_api_fokus_inventories_move";

export class Agenda extends Component {
	constructor (props) {
		super(props);

		this.state = {
			initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay",
			oriData: [],
			data: [],
			loadingData: true,
			element: null,
			properties: [],
			users: [],
			tenants: [],
			models: [],
			dateClicked: "",
			nowEvent: null,
			oldEvent: null
		}

		this.details = React.createRef();
		this.move = React.createRef();
		this.form = React.createRef();
	}

	componentDidMount = () => {
		const { numSociety } = this.props;

		const self = this;
		axios({ method: "GET", url: Routing.generate(URL_GET_DATA_FOKUS, {numSociety: numSociety}), data: {} })
			.then(function (response) {
				let data = JSON.parse(response.data.donnees);

				let properties = JSON.parse(response.data.properties);
				let users = JSON.parse(response.data.users);
				let models = JSON.parse(response.data.models);
				let tenants = JSON.parse(response.data.tenants);

				let nData = [];
				data.forEach(elem => {
					if(elem.date !== "" && elem.date !== 0){
						elem.property = null;
						elem.user = null;
						elem.model = null;
						elem.tenantsData = [];

						properties.forEach(pr => {
							if(pr.uid === elem.propertyUid){
								elem.property = pr;
							}
						})

						users.forEach(us => {
							if(us.id === elem.userId){
								elem.user = us;
							}
						})

						if(elem.input < 0){
							models.forEach(mo => {
								if(mo.id === Math.abs(elem.input)){
									elem.model = mo;
								}
							})
						}

						if(elem.tenants){
							JSON.parse(elem.tenants).forEach(te => {
								tenants.forEach(tenant => {
									if(te === tenant.reference){
										elem.tenantsData.push(tenant)
									}
								})
							})
						}

						nData.push(createEventStructureFromFokus(elem));
					}
				})
				self.setState({
					oriData: data,
					data: nData,
					properties: properties,
					users: users,
					tenants: tenants,
					models: models,
					loadingData: false
				})
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	handleEventDidMount = (e) => {
		addEventElement(e.el, e.event);
	}

	handleDetails = (elem) => {
		const { oriData } = this.state;

		let element = null;
		oriData.forEach(el => {
			if(el.id === parseInt(elem.event.id)){
				element = el;
			}
		})

		this.setState({ element: element })
		this.details.current.handleClick();
	}

	handleUpdate = () => {
		this.details.current.handleClose();
		this.form.current.handleClick();
	}

	handleClick = (e) => {
		this.setState({ dateClicked: moment(e.date).format('YYYY-MM-DDTHH:mm') })
		this.form.current.handleClick();
	}

	handleMove = (e) => {
		this.setState({ nowEvent: e.event, oldEvent: e.oldEvent });
		this.move.current.handleClick();
	}

	handleSubmitMove = (e) => {
		const { nowEvent, oldEvent } = this.state;

		const self = this;
		Formulaire.loader(true);
		axios({ method: "PUT", url: Routing.generate(URL_MOVE_ELEMENT, {id: oldEvent.id}), data: {timestamp: moment(nowEvent.start).format('X')} })
			.then(function (response) {
				location.href = Routing.generate(URL_INDEX_ELEMENTS, { h: oldEvent.id });
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
				Formulaire.loader(false);
			})
		;
	}

	render () {
		const { userId } = this.props;
		const { loadingData, initialView, data, element, properties, users, tenants, models, dateClicked, nowEvent, oldEvent } = this.state;

		return <div>
			{loadingData
				? <LoaderElements />
				: <div className="module-calendar" id="fullcalendar-custom">
					<FullCalendar
						locale={frLocale}
						initialView={initialView}
						plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
						headerToolbar={{
							left: 'timeGridDay,timeGridWeek',
							center: 'title',
							right: 'prev,next'
						}}
						allDayText={""}
						hiddenDays={[0]}
						slotMinTime={"07:00:00"}
						slotMaxTime={"22:00:00"}
						eventMinHeight={60}
						editable={true}
						droppable={true}
						events={data}
						eventDidMount={this.handleEventDidMount}
						eventClick={this.handleDetails}
						eventDrop={this.handleMove}
						dateClick={this.handleClick}
					/>
				</div>
			}

			{createPortal(<Modal ref={this.details} identifiant='details-edl' maxWidth={1024} margin={5}
								 title={element ? `Détails de ${element.uid}` : ""}
								 content={element ? <InventoryDetails elem={element} key={element.id} /> : null}
								 footer={<Button type="blue" onClick={this.handleUpdate}>Modifier</Button>}
			/>, document.body)}

			{createPortal(<Modal ref={this.move} identifiant='move-edl' maxWidth={568}
								 title={nowEvent && oldEvent ? `Déplacer l'état des lieux : ${oldEvent.title}` : ""}
								 content={nowEvent && oldEvent ? <div>
									 Souhaitez-vous déplacer l'état des
									 lieux : <i>{oldEvent.title}</i> au <b>{moment(nowEvent.start).format('LLL')}</b>
								 </div> : null}
								 footer={<Button type="blue" onClick={this.handleSubmitMove}>Confirmer le déplacement</Button>}
			/>, document.body)}

			{createPortal(<Modal ref={this.form} identifiant='form-edl' maxWidth={568} margin={5}
								 title={element ? `Modifier ${element.id}` : "Ajouter un état des lieux"}
								 isForm={true}
								 content={<InventoryFormulaire context={element ? "update" : "create"} element={element ? element : null}
															   userId={parseInt(userId)} dateClicked={dateClicked}
															   properties={properties} users={users} tenants={tenants} models={models}
															   identifiant="form-edl" key={element ? element.id : dateClicked} />}
			/>, document.body)}
		</div>
	}
}

function createEventStructureFromFokus (elem) {
	let start = moment(elem.date * 1000).format('YYYY-MM-DD HH:mm');

	return {
		id: elem.id,
		title: elem.property.addr1,
		start: start,
		allDay: false,
		extendedProps: {
			startHours: moment(elem.date * 1000).format('HH:mm'),
			type: elem.type === 0 ? "Sortant" : "Entrant",
			addr2: elem.property.addr2,
			addr3: elem.property.addr3,
			where: elem.property.zipcode + ', ' + elem.property.city,
		},
		classNames: (elem.type) === 0 ? "sortant" : "entrant"
	};
}

function addEventElement (bloc, event) {
	bloc.innerHTML = "";

	bloc.insertAdjacentHTML('beforeend', '<div class="text-sm font-medium p-2">'+  event.extendedProps.startHours + " - " + event.extendedProps.type +'</div>')
	bloc.insertAdjacentHTML('beforeend', '<div class="text-gray-600 text-sm px-2">' + event.title + '</div>')
	bloc.insertAdjacentHTML('beforeend', '<div class="text-gray-600 text-sm px-2">' + event.extendedProps.addr2 + '</div>')
	bloc.insertAdjacentHTML('beforeend', '<div class="text-gray-600 text-sm px-2">' + event.extendedProps.addr3 + '</div>')
	bloc.insertAdjacentHTML('beforeend', '<div class="text-gray-600 text-sm px-2">'+ event.extendedProps.where +'</div>')
}
