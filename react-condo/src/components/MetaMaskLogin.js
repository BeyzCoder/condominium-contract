import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

import MetaMaskLogo from '../images/metamask_logo.png';
import warningCircle from '../images/warning-circle.svg';
import './MetaMaskLogin.css';

export default function MetaMaskLogin() {
	const [metaError, setMetaError] = useState(false);
	const [connError, setConnError] = useState(true);
	const navigate = useNavigate();

	const connectMetaMask = async () => {
		const provider = window.ethereum;
		try {
			await provider.request({ method: "eth_requestAccounts" });
			const web3 = new Web3(provider);
			const userAccounts = await web3.eth.getAccounts();
			const accountAddress = userAccounts[0];
			navigate(`/account/${accountAddress}`);
		} catch(err) {
			setConnError(false);
		}
	}

	const checkMetaMask = () => {
		if (!window.ethereum)
			setMetaError(true);
	}

	useEffect(() => {
		checkMetaMask();
	}, []);

	return (
		<div className="meta container">
			<img src={MetaMaskLogo} alt="" />
			{ metaError ? 
				<div className="warn">
					<span>
						Install MetaMask Extension
					</span>
					<div className="icon-wrapper">
						<img src={warningCircle} alt="" />
						<span className="warn-msg hidden">
							Need MetaMask to use this app.
						</span>
					</div>
				</div> 
				: 
				( connError ? <button onClick={connectMetaMask}>Connect to Meta</button> 
					: <span>Something went wrong. Refresh page then try again.</span>
				) 
			}
		</div>
	);
}