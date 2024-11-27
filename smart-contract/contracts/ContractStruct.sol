// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.21;

struct PostRule {
    uint256 ruleId;
    string rule;
    uint16 yesCount;
    uint16 noCount;
    uint256 dueDate;
    mapping(address => bool) voted;
    bool status;
}

struct ReturnRule {
    uint256 ruleId;
    string rule;
    uint256 dueDate;
    bool status;
}

struct PostQuota {
    uint256 quotaId;
    uint256 totalFee;
    uint256 totalPay;
    uint256 payment;
    uint256 dueDate;
    mapping(address => bool) paid;
    bool status;
}

struct ReturnQuota {
    uint256 quotaId;
    uint256 totalFee;
    uint256 payment;
    uint256 dueDate;
    bool status;
}

struct PostUnit {
    uint256 unitId;
    uint256 unitPrice;
    string unitURI;
}

struct VisitKey {
    uint256 keyId;
    uint256 dueDate;
    bool status;
}

struct NotifyEvent {
    string typeEvent;
    uint256 dueDate;
    string desc;
    uint256 id;
}