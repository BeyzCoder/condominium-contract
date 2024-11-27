import { useState } from "react";
import { ethers } from "ethers";

import { formatDate } from "../js/DateFormat";
import "./Vote.css";

export default function Vote({ contract, account }) {
	const [hashId, setHashId] = useState("");
	const [rightInput, setRightInput] = useState(false);
	const [info, setInfo] = useState(null);
	const [error, setError] = useState(false);
	const [vote, setVote] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const resp = await contract.methods.voteRule(ethers.toBigInt(hashId), vote).send({from: account});
			alert(`VOTED COMPLETE: you voted ${vote}, the transaction hash: ${resp.transactionHash}`);
		} catch(err) {
			console.log(err);
			setError(true);
			setInfo("Something went wrong on fetching the hash id.");
		}
	}

	const handleVote = (value) => {
		setVote(value);
	}

	const fetchInfo = async (hash) => {
		try {
			const resp = await contract.methods.getPostRule(ethers.toBigInt(hash)).call({from: account});

			console.log(resp);

			setInfo(resp);
			setRightInput(true);
		} catch(err) {
			setError(true);
			setInfo("Something went on fetching the hash id.");
		}
	}

	const handleChange = (e) => {
		const value = e.target.value;
		setHashId(value);

		if (value.length >= 70) {
			fetchInfo(value);
		} else {
			setInfo(null);
			setRightInput(false);
		}
	}

	return (
		<div className="vote">
			<div className="wrapper">
				<h2>Vote:</h2>
				<form onSubmit={handleSubmit}>
					<input type="text" id="hashId" name="hashId" placeholder="Enter Hash Id" value={hashId} onChange={handleChange} />
					{rightInput ? <div className="btn-choice">
						<button style={{color: "#7BE0AD"}} onClick={() => handleVote("yes")}>Yes</button>
						<button style={{color: "#F4442E"}} onClick={() => handleVote("no")}>No</button>
					</div> : <div></div>}
				</form>

				<div className="info-display">
					{error ? info : 
						(rightInput ? 
							<div className="info-detail">
								<h4>Rule Detail</h4>
								<div className="row-detail">
									<span className="label">Rule Id: </span>
									<span>{String(info.ruleId)}</span>
								</div>
								<div className="row-detail">
									<span className="label">Rule Suggestion: </span>
									<span>{info.rule}</span>
								</div>
								<div className="row-detail">
									<span className="label">Due Date: </span>
									<span>{formatDate(parseInt(info.dueDate))}</span>
								</div>
								<div className="row-detail">
									<span className="label">Status: </span>
									<span>{info.status ? "LIVE TO VOTE" : "DEPRECATED" }</span>
								</div>
							</div>
						: <div></div>)
					}
				</div>
			</div>
		</div>
	);
}