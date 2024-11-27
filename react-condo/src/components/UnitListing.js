import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apartment from "../images/apartment.jpg";
import bedIcon from "../images/bed-icon.svg";
import bathIcon from "../images/bath-icon.svg";
import kitchenIcon from "../images/kitchen-icon.svg";
import laundryIcon from "../images/laundry-icon.svg";
import heaterIcon from "../images/heat-icon.svg";
import airconIcon from "../images/air-icon.svg";
import spaceIcon from "../images/space-icon.svg";
import "./UnitListing.css";

export default function UnitListing({ contract, account }) {
	const navigate = useNavigate();
	const [units, setUnits] = useState([]);

	const getUnits = async () => {
		try{
			const resp = await contract.methods.getUnitMarket().call({from: account});
			
			const parsedData = resp.map(item => ({
				...item,
				unitURI: JSON.parse(item.unitURI.replace(/'/g, '"'))
			}));

			setUnits(parsedData);
		} catch (err) {
			console.log(err);
			setUnits([]);
			alert("Something went wrong when grabbing the units from the contract.");
		}
	}

	const transactUnit = async (index, price) => {
		try {
			const resp = await contract.methods.buyUnit(parseInt(index)).send({from: account, value: price});
			console.log(resp);
			alert("Congratulation on buying new unit with us! Feel free to use the other functions.");
			window.location.reload();
		} catch (err) {
			console.log(err);
			alert("Something went wrong when buying the unit.");
		}
	}

	useEffect(() => {
		getUnits();
	}, [])

  return (
		<div className="unit-lising">
			<div className="unit-table">
				<div className="header-row">
					<h2>Unit For Sale:</h2>
					<button>Sell A Unit</button>
				</div>
				<div className="grid-list">
					{units.map((apt, index) => (
						<div className="unit-box" key={index}>
							<div className="apt-imgs">
								<img src={apartment} alt="" />
							</div>
							<div className="apt-id">
								<h4>ID: {`${String(apt.unitId).slice(0,3)}.....${String(apt.unitId).slice(-4)}`}</h4>
							</div>
							<div className="apt-detail">
								<div>
									<img src={bedIcon} alt="bed-icon" />
									<span>Bedrooms: {apt.unitURI.bedrooms}</span>
								</div>
								<div>
									<img src={bathIcon} alt="bath-icon" />
									<span>Bathrooms: {apt.unitURI.bathrooms}</span>
								</div>
								<div>
									<img src={kitchenIcon} alt="kitchen-icon" />
									<span>Kitchen: {apt.unitURI.kitchen}</span>
								</div>
								<div>
									<img src={laundryIcon} alt="laundry-icon" />
									<span>Laundry: {apt.unitURI.laundry}</span>
								</div>
								<div>
									<img src={heaterIcon} alt="heater-icon" />
									<span>Heater: {apt.unitURI.heater}</span>
								</div>
								<div>
									<img src={airconIcon} alt="air-icon" />
									<span>Air-Con: {apt.unitURI.aircon}</span>
								</div>
								<div>
									<img src={spaceIcon} alt="size-icon" />
									<span>Apt-Size: {apt.unitURI.propertySize}</span>
								</div>
							</div>
							<div className="buying">
								<span>$ {parseInt(apt.unitPrice).toLocaleString()}</span>
								<button onClick={() => transactUnit(index, parseInt(apt.unitPrice))} >Buy</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}