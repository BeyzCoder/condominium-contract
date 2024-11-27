import { useState } from "react";
import { ethers } from "ethers";

import { formatDate } from "../js/DateFormat";
import "./Payment.css";

export default function Payment({ contract, account }) {
	const [hashId, setHashId] = useState("");
	const [rightInput, setRightInput] = useState(false);
	const [info, setInfo] = useState(null);
	const [error, setError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const resp = await contract.methods.payQuota(ethers.toBigInt(hashId)).send({from: account, value: parseInt(info.payment)});
			alert(`PAYMENT COMPLETE: transaction hash: ${resp.transactionHash}`);
			setRightInput(false)
			setHashId("");
		} catch(err) {
			console.log(err);
			setError(true);
			setInfo("Something went on fetching the hash id.");
		}
	}

	const fetchInfo = async (hash) => {
		try {
			const resp = await contract.methods.getPostQuota(ethers.toBigInt(hash)).call({from: account});
			setInfo(resp);
			setRightInput(true);
		} catch(err) {
			console.log(err);
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
		<div className="payment">
			<div className="wrapper">
				<h2>Payment:</h2>
				<form onSubmit={handleSubmit}>
					<input type="text" id="hashId" name="hashId" placeholder="Enter Hash Id" value={hashId} onChange={handleChange} />
					{rightInput ? <button>Pay Now</button> : <div></div>}
				</form>
				<div className="info-display">
					{error ? info : 
						(rightInput ? 
							<div className="info-detail">
								<h4>Quote Detail</h4>
								<div className="row-detail">
									<span className="label">Quote Id: </span>
									<span>{String(info.quotaId)}</span>
								</div>
								<div className="row-detail">
									<span className="label">Total Fee: </span>
									<span>$ {parseInt(info.totalFee).toLocaleString()}</span>
								</div>
								<div className="row-detail">
									<span className="label">Payment Fee: </span>
									<span>$ {parseInt(info.payment).toLocaleString()}</span>
								</div>
								<div className="row-detail">
									<span className="label">Due Date: </span>
									<span>{formatDate(parseInt(info.dueDate))}</span>
								</div>
								<div className="row-detail">
									<span className="label">Status: </span>
									<span>{info.status ? "PROCESSING" : "COMPLETED" }</span>
								</div>
							</div>
						: <div></div>)
					}
				</div>
			</div>
		</div>
	);
}