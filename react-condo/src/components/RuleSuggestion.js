import { useState } from "react";
import { ethers } from "ethers";

import "./RuleSuggestion.css";

export default function RuleSuggestion({ contract, account }) {
	const [rule, setRule] = useState("");
	const [display, setDisplay] = useState(false);
	const [submitTicket, setSubmitTicket] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const resp = await contract.methods.postRule(String(rule)).send({from: account});
			console.log(resp);

			const eventReturnId = resp.events.SendNotifyEvent.returnValues.id;
			const result = await contract.methods.getPostRule(ethers.toBigInt(eventReturnId)).call({from: account});
			setSubmitTicket(result);
			setDisplay(true);
			setRule("");
			alert('sent!');
		} catch (err) {
			console.log(err);
			alert('Something went wrong when submitting the rule to the contract.');
		}
	}

	const handleChange = (e) => {
		const value = e.target.value;
		setRule(value);
	}

  return (
		<div className="rule-suggestion">
			<div className="wrapper">
				<h2>Rule Suggestion:</h2>
				<form onSubmit={handleSubmit}>
					<textarea name="rule" id="rule" value={rule} onChange={handleChange} placeholder="What rule do you have in mind?" />
					<button>Submit</button>
				</form>
				{display ? 
					<div className="rule-receit"> 
						<h4>Post Detail:</h4>
						<div className="row-detail">
							<span className="label">Rule Id: </span>
							<span>{String(submitTicket.ruleId)}</span>
						</div>
						<div className="row-detail">
							<span className="label">Rule Suggestion: </span>
							<span>{submitTicket.rule}</span>
						</div>
						<div className="row-detail">
							<span className="label">Status: </span>
							<span>{submitTicket.status ? "LIVE TO VOTE" : "DEPRECATED"}</span>
						</div>
					</div> : <div></div>
				}
			</div>
		</div>
	);
}