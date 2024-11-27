import { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import ContractArtifact from "../contract/Condo.json";

import NotificationTable from "../components/NotificationTable";
import UnitListing from "../components/UnitListing";
import Payment from "../components/Payment";
import RuleSuggestion from "../components/RuleSuggestion";
import Vote from "../components/Vote";
import VisitPermission from "../components/VisitPermission";

import eventIcon from "../images/event-icon.svg";
import unitIcon from "../images/unit-icon.svg";
import payIcon from "../images/payment-icon.svg";
import ruleIcon from "../images/rule-icon.svg";
import voteIcon from "../images/vote-icon.svg";
import visitIcon from "../images/visit-icon.svg";
import "./Account.css";

export default function Account() {
	const [condoContract, setCondoContract] = useState(null);
	const [account, setAccount] = useState(null);
	const [authAccount, setAuthAccount] = useState(false);

	const getContract = async () => {
		const provider = await detectEthereumProvider();
		const web3 = new Web3(provider || Web3.givenProvider);

		const metaAccounts = await provider.request({method: "eth_requestAccounts"});
		const metaAccount = metaAccounts[0];

		setAccount(metaAccount);

		const contractABI = ContractArtifact.abi;
		const contractAddress = ContractArtifact.networks[5777].address;

		const Condo = new web3.eth.Contract(contractABI, contractAddress);

		setCondoContract(Condo);

	}

	const empty = () => <div></div>;
	const notif = () => <NotificationTable contract={condoContract} account={account} />;
	const unit = () => <UnitListing contract={condoContract} account={account} />;
	const pay = () => <Payment contract={condoContract} account={account} />;
	const rule = () => <RuleSuggestion contract={condoContract} account={account} />;
	const vote = () => <Vote contract={condoContract} account={account} />;
	const visit = () => <VisitPermission contract={condoContract} account={account} />;

	const [displayPage, setDisplayPage] = useState(empty);
	const [activeIndex, setActiveIndex] = useState(0);

	const handleDisplay = (index) => {
		switch (index) {
			case 0:
				setDisplayPage(notif);
				break;
			case 1:
				setDisplayPage(unit);
				break;
			case 2:
				setDisplayPage(pay);
				break;
			case 3:
				setDisplayPage(rule);
				break;
			case 4:
				setDisplayPage(vote);
				break;
			case 5:
				setDisplayPage(visit);
				break;
			default:
				setDisplayPage(empty);
				break;
		}
	}

	const handleActive = (index) => {
		setActiveIndex(index);
		handleDisplay(index)
	};

	useEffect(() => {
    if (condoContract && account) {
        const checkResidentStatus = async () => {
            try {
                const resp = await condoContract.methods.isResident().call({ from: account });
                if (resp) {
                    setDisplayPage(notif);
                    setAuthAccount(true);
                } else {
                    setDisplayPage(unit);
                    setAuthAccount(false);
                }
            } catch (error) {
                console.error("Error in isResident call:", error);
            }
        };

        checkResidentStatus();
    }
	}, [condoContract, account]); // Re-run when condoContract or account changes

	useEffect(() => {
    getContract(); // Call getContract on component mount
	}, []);

	return (
		<div className="account container">
			<div className="panel">
				<div className="account-info">
					<h1>Account</h1>
				</div>
				<ul>
					{ authAccount ? <li className={activeIndex === 0 ? "active" : ""}
					onClick={() => handleActive(0)}>
						<img src={eventIcon} alt="nav-icon" />
						<span>Events</span></li> : <li></li>}
					<li className={activeIndex === 1 ? "active" : ""}
					onClick={() => handleActive(1)}>
						<img src={unitIcon} alt="nav-icon" />
						<span>Unit Listing</span></li>
					{ authAccount ? <li className={activeIndex === 2 ? "active" : ""}
					onClick={() => handleActive(2)}>
						<img src={payIcon} alt="nav-icon" />
						<span>Payment</span></li> : <li></li>}
					{ authAccount ? <li className={activeIndex === 3 ? "active" : ""}
					onClick={() => handleActive(3)}>
						<img src={ruleIcon} alt="nav-icon" />
						<span>Rule Suggestion</span></li> : <li></li>}
					{ authAccount ? <li className={activeIndex === 4 ? "active" : ""}
					onClick={() => handleActive(4)}>
						<img src={voteIcon} alt="nav-icon" />
						<span>Vote</span></li> : <li></li>}
					{ authAccount ? <li className={activeIndex === 5 ? "active" : ""}
					onClick={() => handleActive(5)}>
						<img src={visitIcon} alt="nav-icon" />
						<span>Visit Permission</span></li> : <li></li>}
				</ul>
			</div>
			<div className="display-page">
				{displayPage}
			</div>
		</div>
	);
}