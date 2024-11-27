import { useState, useEffect } from "react";

import { formatDate } from "../js/DateFormat";
import copyIcon from "../images/copy-icon.svg";
import "./NotificationTable.css";

export default function NotificationTable({ contract, account }) {
	const [notifications, setNotifications] = useState([]);
	const [copyMessage, setCopyMessage] = useState(false);

	const getNotifications = async () => {
		try {
			const resp = await contract.methods.getNotifications().call({from: account});
			setNotifications(resp);
		} catch (err) {
			setNotifications([]);
			alert(`Something went wrong when grabbing the notifications from the contract.`);
		}
	}

	useEffect(() => {
		getNotifications();
	}, []);

  return (
		<div className="notification">
			{copyMessage ? <span className="copy-prompt">
				Copied Id!
			</span> : <span></span> }
			<div className="event-table">
				<h2>Notifications:</h2>
				{notifications.slice().reverse().map((event, index) => (
					<div className="event-row" key={index}>
						<div className="type-event"
							style={{
								backgroundColor: 
									event.typeEvent === "Post Rule" ? "#F0F097" :
									event.typeEvent === "Quota" ? "#A3F7B5" :
									event.typeEvent === "Visitor" ? "#EFC7E5" :
									event.typeEvent === "New Resident" ? "#A1CDF1" :
									event.typeEvent === "New Rule" ? "#D8A47F" :
									"transparent", // Default color if none of the conditions match
							}}
						>
							<h3>{event.typeEvent}</h3>
							<div className="event-id"
								style={{
									display: event.typeEvent === "Visitor" || event.typeEvent === "New Resident" || event.typeEvent === "New Rule" ? "none" : "flex"
								}}
							>
								<h3>ID: {`${String(event.id).slice(0,3)}.....${String(event.id).slice(-4)}`}</h3>
								<img src={copyIcon} alt="copy" onClick={() => {
									navigator.clipboard.writeText(event.id)
									.then(() => {
										setCopyMessage(true);
										setTimeout(() => setCopyMessage(false), 3000);
									})
									.catch((err) => {
										console.log("Failed to copy:", err)
									})
								}}/>
							</div>
						</div>
						<div className="detail-event">
							<p>{event.desc}</p>
						</div>
						<div className="due-date">
							<p>Due Date: {formatDate(parseInt(event.dueDate))}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}