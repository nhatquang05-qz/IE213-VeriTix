// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// 1. TỐI ƯU: Sử dụng Custom Errors thay cho require()
error VeriTix__EventClosed();
error VeriTix__SoldOut();
error VeriTix__InsufficientFunds();
error VeriTix__InvalidQuantity();
error VeriTix__MissingTokenURIs();
error VeriTix__NotTicketOwner();
error VeriTix__TicketAlreadyUsed();
error VeriTix__PriceExceedsMax();
error VeriTix__TicketNotForSale();
error VeriTix__TransferFailed();

contract VeriTix is ERC721URIStorage, Ownable, ReentrancyGuard {
    // 2. TỐI ƯU: Hạ kiểu dữ liệu xuống uint64 vì không có dự án nào tạo ra > 18 tỷ token/event
    uint64 private _tokenIds;
    uint64 private _eventIds;

    // 3. TỐI ƯU: Struct Packing (Gói gọn bộ nhớ vào chung Slot)
    struct Event {
        uint256 price;          // Slot 1: 32 bytes
        uint256 maxPrice;       // Slot 2: 32 bytes
        uint64 id;              // Slot 3: 8 bytes
        uint64 maxSupply;       // Slot 3: 8 bytes
        uint64 currentMinted;   // Slot 3: 8 bytes
        bool isActive;          // Slot 3: 1 byte
        address organizer;      // Slot 4: 20 bytes (Gói gọn chung với isActive)
        string name;            // Slot 5: Dynamic
    }

    struct Ticket {
        uint256 id;             // Slot 1: 32 bytes
        uint256 resalePrice;    // Slot 2: 32 bytes
        uint64 eventId;         // Slot 3: 8 bytes
        bool isUsed;            // Slot 3: 1 byte
        address seller;         // Slot 3: 20 bytes (Vừa khít 29 bytes < 32 bytes trong 1 Slot)
    }

    mapping(uint64 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    event EventCreated(uint64 indexed eventId, string name, address organizer);
    event TicketMinted(uint256 indexed ticketId, uint64 indexed eventId, address buyer);
    event TicketListed(uint256 indexed ticketId, uint256 price, address seller);
    event TicketSold(uint256 indexed ticketId, address from, address to, uint256 price);
    event TicketCheckedIn(uint256 indexed ticketId, address owner);

    constructor() ERC721("VeriTix NFT", "VTX") Ownable(msg.sender) {}

    // HÀM ĐỒNG BỘ ID VỚI MONGODB KHI RE-DEPLOY
    function setInitialIds(uint64 eventId, uint64 tokenId) external onlyOwner {
        _eventIds = eventId;
        _tokenIds = tokenId;
    }

    // 4. TỐI ƯU: Đổi public thành external & dùng calldata
    function createEvent(string calldata name, uint256 price, uint64 maxSupply, uint256 maxResellPercentage) external returns (uint64) {
        unchecked { _eventIds++; } // TỐI ƯU: Bỏ kiểm tra tràn số
        uint64 newEventId = _eventIds;

        uint256 calculatedMaxPrice = (price * maxResellPercentage) / 100;

        events[newEventId] = Event({
            id: newEventId,
            name: name,
            price: price,
            maxPrice: calculatedMaxPrice,
            maxSupply: maxSupply,
            currentMinted: 0,
            organizer: msg.sender,
            isActive: true
        });

        emit EventCreated(newEventId, name, msg.sender);
        return newEventId;
    }

    function buyTicket(uint64 eventId, string calldata tokenURI) external payable nonReentrant returns (uint256) {
        Event storage myEvent = events[eventId];
        if (!myEvent.isActive) revert VeriTix__EventClosed();
        
        // 5. TỐI ƯU: Lưu Cache các biến Storage vào Memory để đọc nhanh hơn
        uint64 currentMinted = myEvent.currentMinted;
        if (currentMinted >= myEvent.maxSupply) revert VeriTix__SoldOut();
        
        uint256 eventPrice = myEvent.price;
        if (msg.value < eventPrice) revert VeriTix__InsufficientFunds();

        myEvent.currentMinted = currentMinted + 1;
        
        unchecked { _tokenIds++; }
        uint256 newTicketId = _tokenIds;

        tickets[newTicketId] = Ticket({
            id: newTicketId,
            eventId: eventId,
            isUsed: false,
            resalePrice: 0,
            seller: address(0)
        });

        // 6. TỐI ƯU & BẢO MẬT: Dùng call thay cho transfer
        (bool success, ) = myEvent.organizer.call{value: msg.value}("");
        if (!success) revert VeriTix__TransferFailed();

        _mint(msg.sender, newTicketId);
        _setTokenURI(newTicketId, tokenURI);

        emit TicketMinted(newTicketId, eventId, msg.sender);
        return newTicketId;
    }

    function buyTickets(uint64 eventId, uint64 quantity, string[] calldata _tokenURIs) external payable nonReentrant {
        if (quantity == 0 || quantity > 3) revert VeriTix__InvalidQuantity();
        if (_tokenURIs.length != quantity) revert VeriTix__MissingTokenURIs();

        Event storage myEvent = events[eventId];
        if (!myEvent.isActive) revert VeriTix__EventClosed();
        
        uint64 currentMinted = myEvent.currentMinted;
        if (currentMinted + quantity > myEvent.maxSupply) revert VeriTix__SoldOut();
        
        uint256 eventPrice = myEvent.price;
        if (msg.value < eventPrice * quantity) revert VeriTix__InsufficientFunds();

        myEvent.currentMinted = currentMinted + quantity;

        (bool success, ) = myEvent.organizer.call{value: msg.value}("");
        if (!success) revert VeriTix__TransferFailed();

        // 7. TỐI ƯU: Vòng lặp
        for (uint64 i = 0; i < quantity;) {
            unchecked { _tokenIds++; }
            uint256 newTicketId = _tokenIds;

            tickets[newTicketId] = Ticket({
                id: newTicketId,
                eventId: eventId,
                isUsed: false,
                resalePrice: 0,
                seller: address(0)
            });

            _mint(msg.sender, newTicketId);
            _setTokenURI(newTicketId, _tokenURIs[i]);

            emit TicketMinted(newTicketId, eventId, msg.sender);
            
            unchecked { ++i; } // TỐI ƯU: ++i rẻ hơn i++ và bỏ kiểm tra tràn số
        }
    }

    function listTicket(uint256 ticketId, uint256 price) external {
        if (ownerOf(ticketId) != msg.sender) revert VeriTix__NotTicketOwner();
        
        Ticket storage ticket = tickets[ticketId];
        if (ticket.isUsed) revert VeriTix__TicketAlreadyUsed();
        
        Event storage myEvent = events[ticket.eventId];
        if (price > myEvent.maxPrice) revert VeriTix__PriceExceedsMax();

        ticket.resalePrice = price;
        ticket.seller = msg.sender;

        _transfer(msg.sender, address(this), ticketId);

        emit TicketListed(ticketId, price, msg.sender);
    }

    function buyResellTicket(uint256 ticketId) external payable nonReentrant {
        Ticket storage ticket = tickets[ticketId];
        uint256 price = ticket.resalePrice;
        if (price == 0) revert VeriTix__TicketNotForSale();
        if (msg.value < price) revert VeriTix__InsufficientFunds();

        address seller = ticket.seller;
        
        Event storage myEvent = events[ticket.eventId];
        uint256 royaltyFee = (price * 5) / 100; 
        uint256 sellerReceive = price - royaltyFee;

        ticket.resalePrice = 0;
        ticket.seller = address(0);

        _transfer(address(this), msg.sender, ticketId);

        (bool successRoyalty, ) = myEvent.organizer.call{value: royaltyFee}("");
        if (!successRoyalty) revert VeriTix__TransferFailed();

        (bool successSeller, ) = seller.call{value: sellerReceive}("");
        if (!successSeller) revert VeriTix__TransferFailed();

        emit TicketSold(ticketId, seller, msg.sender, price);
    }

    function checkIn(uint256 ticketId) external {
        Ticket storage ticket = tickets[ticketId];
        if (ticket.isUsed) revert VeriTix__TicketAlreadyUsed();
        
        ticket.isUsed = true;
        emit TicketCheckedIn(ticketId, ownerOf(ticketId));
    }
}