// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./ContractStruct.sol";

contract Condo is ERC721URIStorage {
        address private OWNER;

    // This will be use to generate sha256 id.
    uint256 private unitCount = 0;
    uint256 private visitKeyCount = 0;
    uint256 private ruleCount = 0;
    uint256 private quotaCount = 0;

    // Keep record of the condominium.
    uint16 private numberResidents = 0;

    mapping(address => uint256) private residents;
    mapping(uint256 => PostRule) private ruleDocuments;
    mapping(uint256 => PostQuota) private quotaDocuments;
    
    PostUnit[] public unitMarket;
    NotifyEvent[] public notifications;
    string[] public termsAndAgreements;

    // Notifications event.
    event SendNotifyEvent(string typeEvent, uint256 dueDate, string decs, uint256 id);

    // function's restrictions.
    modifier onlyResident() { require(residents[msg.sender] != 0, "Sorry, You are not a resident here.");  _;}
    modifier holderNFT(uint256 _unitId) { require(residents[msg.sender] == _unitId, "Sorry, You are not the owner of the unit.");  _;}
    modifier onlyOwner() { require(OWNER == msg.sender, "Sorry, you do not have the right to execute this."); _;}

    constructor() ERC721("CondoNFT", "CNFT") { 
        OWNER = msg.sender; 

        // Initialize some ready units to play around.
        mintUnit('{"bedrooms": "1", "bathrooms": "1", "kitchen": "included", "heater": "included", "aircon": "included", "laundry": "not-included", "propertySize": "518sqft"}', 20000);
        mintUnit('{"bedrooms": "2", "bathrooms": "1", "kitchen": "included", "heater": "included", "aircon": "included", "laundry": "not-included", "propertySize": "593sqft"}', 30000);
        mintUnit('{"bedrooms": "2", "bathrooms": "1", "kitchen": "included", "heater": "included", "aircon": "included", "laundry": "included", "propertySize": "632sqft"}', 40000);
        mintUnit('{"bedrooms": "2", "bathrooms": "2", "kitchen": "included", "heater": "included", "aircon": "included", "laundry": "included", "propertySize": "718sqft"}', 50000);
    }

    // Create a unit.
    function mintUnit(string memory _unitURI, uint256 _unitPrice) public onlyOwner {
        // Generate unique id.
        unitCount++;
        uint256 unitId = uint256(keccak256(abi.encodePacked(unitCount, block.timestamp)));

        // Mint NFT.
        _safeMint(msg.sender, unitId);
        _setTokenURI(unitId, _unitURI);

        PostUnit memory unit = PostUnit(unitId, _unitPrice, _unitURI);
        unitMarket.push(unit);
    }

        // Calculate the percentage of the total vote.
    function percentage(uint16 _yesCount) private view returns (uint16) {
        return (_yesCount * 100) / numberResidents;
    }

    // Grab the unit market list.
    function getUnitMarket() public view returns (PostUnit[] memory) {
        return unitMarket;
    }

    // Grab the notify event list.
    function getNotifications() public view returns (NotifyEvent[] memory) {
        return notifications;
    }

    // Grab the Post Rule.
    function getPostRule(uint256 _ruleId) public view returns (ReturnRule memory) {
        PostRule storage rule = ruleDocuments[_ruleId];
        return ReturnRule(rule.ruleId, rule.rule, rule.dueDate, rule.status);
    }

    // Grab the Post Quota
    function getPostQuota(uint256 _quotaId) public view returns (ReturnQuota memory) {
        PostQuota storage quota = quotaDocuments[_quotaId];
        return ReturnQuota(quota.quotaId, quota.totalFee, quota.payment, quota.dueDate, quota.status);
    }

    // Authorization residential.
    function isResident() public view returns(bool) {
        if (residents[msg.sender] != 0)
            return true;
        return false;
    }

    // Post a new rule for the terms and agreements of houseowner association.
    function postRule(string memory _rule) public onlyResident {
        // Generate ruleId.
        ruleCount++;
        uint256 ruleId = uint256(keccak256(abi.encodePacked(ruleCount, block.timestamp)));

        uint256 dueDate = block.timestamp + 30 days;

        PostRule storage rule = ruleDocuments[ruleId];
        rule.ruleId = ruleId;
        rule.rule = _rule;
        rule.dueDate = dueDate;
        rule.status = true;

        string memory desc = "A new rule was proposed, please vote by the end of due date. If you want to see the rule go to the vote page";
        NotifyEvent memory notif = NotifyEvent("Post Rule", dueDate, desc, ruleId);
        notifications.push(notif);
        emit SendNotifyEvent("Post Rule", dueDate, desc, ruleId);
    }

    // Place a vote for post rule.
    function voteRule(uint256 ruleId, string memory _vote) public onlyResident {
        PostRule storage rule = ruleDocuments[ruleId];

        // Check if the resident already voted and if it is already fulfilled.
        require(!rule.voted[msg.sender], "Sorry, you already voted for the rule!");
        require(rule.status, "This post is already done.");

        if ((keccak256(abi.encodePacked(_vote)) == keccak256(abi.encodePacked("yes")))) 
            rule.yesCount++;
        else
            rule.noCount++;

        rule.voted[msg.sender] = true;
    }

    // Check if the vote is enough to pass the new rule.
    function passedRule(uint256 ruleId) public onlyOwner {
        PostRule storage rule = ruleDocuments[ruleId];

        if (percentage(rule.yesCount) >= 60) {
            termsAndAgreements.push(rule.rule);
            rule.status = false;

            uint256 dueDate = block.timestamp;

            string memory desc = "A new rule has pass, kindly check on the terms and agreements.";
            NotifyEvent memory notif = NotifyEvent("New Rule", dueDate, desc, ruleId);
            notifications.push(notif);
            emit SendNotifyEvent("New Rule", dueDate, desc, ruleId);
        }
    }

    // Post new quota for HOA fee.
    function postQuota(uint256 _totalFee) public onlyOwner {
        // Generate quotaId.
        quotaCount++;
        uint256 quotaId = uint256(keccak256(abi.encodePacked(quotaCount, block.timestamp)));

        uint256 dueDate = block.timestamp + 30 days;
        uint256 payment = (_totalFee / numberResidents) + 1;

        PostQuota storage quota = quotaDocuments[quotaId];
        quota.quotaId = quotaId;
        quota.totalFee = _totalFee;
        quota.dueDate = dueDate;
        quota.payment = payment;
        quota.status = true;
        
        string memory desc = "A new quota for HOA fee for this month, please pay by the end of the date. If you want to see how much go to payment page";
        NotifyEvent memory notif = NotifyEvent("Quota", dueDate, desc, quotaId);
        notifications.push(notif);
        emit SendNotifyEvent("Quota", dueDate, desc, quotaId);
    }

    // Do payment for HOA fee.
    function payQuota(uint256 _quotaId) public payable onlyResident {
        PostQuota storage quota = quotaDocuments[_quotaId];

        // Check some requirements.
        require(quota.payment == msg.value, "Cannot proceed payment! Insufficient funds.");
        require(!quota.paid[msg.sender], "You already paid your fee.");
        require(quota.status, "This quota is already done.");

        quota.totalPay += quota.payment;
        quota.paid[msg.sender] = true;
    }

    // Take out the fee from the contract.
    function takeQuota(uint256 _quotaId) public payable onlyOwner {
        PostQuota storage quota = quotaDocuments[_quotaId];

        require(quota.status, "This quota is already taken out.");

        quota.status = false;
        payable(msg.sender).transfer(quota.totalPay);
    }

    function buyUnit(uint256 _index) public payable {
        PostUnit storage unit = unitMarket[_index];

        require(msg.value == unit.unitPrice, "The price is not the right amount.");

        // Grab the address of the previous owner of the house.
        address prevOwner = ownerOf(unit.unitId);

        // transfer the unit to the new owner.
        _safeTransfer(prevOwner, msg.sender, unit.unitId);

        residents[prevOwner] = 0;
        residents[msg.sender] = unit.unitId;

        unitMarket[_index] = unitMarket[unitMarket.length-1];      // place the last element to the index of unit listing.
        unitMarket.pop();                                                 // then remove the last element.

        uint256 dueDate = block.timestamp;

        string memory desc = "New resident in the condominium, please welcome them.";
        NotifyEvent memory notif = NotifyEvent("New Resident", dueDate, desc, unit.unitId);
        notifications.push(notif);
        emit SendNotifyEvent("New Resident", dueDate, desc, unit.unitId);

        numberResidents++;
        // Send the money to the previous owner.
        payable(prevOwner).transfer(msg.value);
    }

    // Create a key for the visitor that shouldn't be shared.
    function postVisit() public onlyResident returns (VisitKey memory) {
        // Generate key.
        visitKeyCount++;
        uint256 keyId = uint256(keccak256(abi.encodePacked(visitKeyCount)));

        uint256 dueDate = block.timestamp + 1 days;
        
        string memory desc = "There will be a visitor coming today.";
        NotifyEvent memory notif = NotifyEvent("Visitor", dueDate, desc, keyId);
        notifications.push(notif);
        emit SendNotifyEvent("Visitor", dueDate, desc, keyId);
        
        VisitKey memory key = VisitKey(keyId, dueDate, true);
        return key;
    }
}