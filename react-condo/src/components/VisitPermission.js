import { useState } from "react";

import { formatDate } from "../js/DateFormat";
import "./VisitPermission.css";

export default function VisitPermission({ contract, account }) {
	const [display, setDisplay] = useState(false);
	const [submitTicket, setSubmitTicket] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const resp = await contract.methods.postVisit().send({from: account});
			console.log(resp);

			const eventValues = resp.events.SendNotifyEvent.returnValues;
			setSubmitTicket(eventValues);

			// setSubmitTicket(data);
			setDisplay(true);
		}
		catch (err) {
			console.log(err);
			setDisplay(false);
			alert("Something went wrong grabbing the event.");
		}		
	}

	return (
		<div className="visit">
			<div className="wrapper">
				<h2>Visit Permission:</h2>
				<form onSubmit={handleSubmit}>
					<button>Generate Permission Today</button>
				</form>
				{display ? 
					<div className="rule-receit"> 
						<h4>Generated Key Detail:</h4>
						<div className="row-detail">
							<span className="label">Visit Id: </span>
							<span>{String(submitTicket.id)}</span>
						</div>
						<div className="row-detail">
							<span className="label">Key valid until: </span>
							<span>{formatDate(parseInt(submitTicket.dueDate))}</span>
						</div>
					</div> : <div></div>
				}
			</div>
		</div>
	);
}