import React, { Component } from "react";

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

import { LoaderElements } from "@tailwindComponents/Elements/Loader";

const URL_GET_DATA = "intern_api_agenda_events_list";
const URL_GET_DATA_FOKUS = "intern_api_fokus_inventories_agenda";
const URL_UPDATE_ELEMENT = "admin_agenda_update";

export class Agenda extends Component {
	constructor (props) {
		super(props);

		this.state = {
			initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay",
			data: [],
			loadingData: true
		}
	}

	componentDidMount = () => {
		const { isFokus, numSociety } = this.props;

		if(isFokus === "1"){
			const self = this;
			axios({ method: "GET", url: Routing.generate(URL_GET_DATA_FOKUS, {numSociety: numSociety}), data: {} })
				.then(function (response) {
					let data = JSON.parse(response.data.donnees);
					let properties = JSON.parse(response.data.properties);
					let nData = [];
					data.forEach(elem => {
						if(elem.date !== "" && elem.date !== 0){
							elem.property = null;
							properties.forEach(pr => {
								if(pr.uid === elem.propertyUid){
									elem.property = pr;
								}
							})

							nData.push(createEventStructureFromFokus(elem));
						}
					})
					self.setState({ data: nData, loadingData: false })
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
			;
		}else{
			const self = this;
			axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
				.then(function (response) {
					let data = response.data;
					let nData = [];
					data.forEach(elem => {
						nData.push(createEventStructure(elem));
					})
					self.setState({ data: nData, loadingData: false })
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
			;
		}
	}

	handleEventDidMount = (e) => {
		addEventElement(e.el, e.event);
	}

	handleUpdatePage = (e) => {
		location.href = Routing.generate(URL_UPDATE_ELEMENT, { id: e.event.id })
	}

	render () {
		const { isFokus } = this.props;
		const { loadingData, initialView, data } = this.state;

		return <div>
			{loadingData
				? <LoaderElements />
				: <div className="module-calendar" id="fullcalendar-custom">
					<FullCalendar
						locale={frLocale}
						initialView={initialView}
						plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
						headerToolbar={{
							left: 'timeGridDay,dayGridMonth,timeGridWeek',
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
						eventClick={this.handleUpdatePage}
					/>
				</div>
			}
		</div>
	}
}

function createEventStructure (elem) {
	let params = {
		id: elem.id,
		title: elem.name,
		start: moment(elem.startAt).format('YYYY-MM-DD HH:mm'),
		allDay: elem.allDay,
		extendedProps: {
			localisation: elem.localisation,
			content: elem.content,
		},
		classNames: "event"
	};

	if (!elem.allDay && elem.endAt) {
		params = { ...params, ...{ endAt: moment(elem.endAt).format('YYYY-MM-DD HH:mm') } }
	}

	return params
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
