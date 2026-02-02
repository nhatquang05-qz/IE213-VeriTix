
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

contract VeriTix is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _tokenIds;
    uint256 private _eventIds;

    struct Event {
        uint256 id;
        string name;
        uint256 originalPrice; 
        uint256 maxResellPrice; 
        uint256 maxSupply;
        uint256 currentMinted;
        address organizer;
        bool isActive;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        bool isUsed;
        uint256 currentPrice; 
        bool isForSale;       
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    event EventCreated(uint256 indexed eventId, string name, uint256 maxResellPrice);
    event TicketListed(uint256 indexed ticketId, uint256 price);
    event TicketResold(uint256 indexed ticketId, address from, address to, uint256 price);

    constructor() ERC721("VeriTix Pro", "VTX") Ownable(msg.sender) {
        
        _setDefaultRoyalty(msg.sender, 500); 
    }

    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    
    function createEvent(string memory name, uint256 price, uint256 maxSupply, uint256 maxResellPercent) public {
        _eventIds++;
        uint256 newEventId = _eventIds;
        
        
        uint256 maxPrice = (price * maxResellPercent) / 100;

        events[newEventId] = Event({
            id: newEventId,
            name: name,
            originalPrice: price,
            maxResellPrice: maxPrice,
            maxSupply: maxSupply,
            currentMinted: 0,
            organizer: msg.sender,
            isActive: true
        });
        
        emit EventCreated(newEventId, name, maxPrice);
    }

    
    function buyTicket(uint256 eventId, string memory tokenURI) public payable {
        Event storage myEvent = events[eventId];
        require(msg.value >= myEvent.originalPrice, "Khong du tien");
        require(myEvent.currentMinted < myEvent.maxSupply, "Het ve");

        payable(myEvent.organizer).transfer(msg.value);

        _tokenIds++;
        uint256 newTicketId = _tokenIds;

        tickets[newTicketId] = Ticket({
            id: newTicketId,
            eventId: eventId,
            isUsed: false,
            currentPrice: 0,
            isForSale: false
        });

        myEvent.currentMinted++;
        _mint(msg.sender, newTicketId);
        _setTokenURI(newTicketId, tokenURI);
        
        
        
        _setTokenRoyalty(newTicketId, myEvent.organizer, 1000); 
    }

    
    function listTicketForSale(uint256 ticketId, uint256 price) public {
        require(ownerOf(ticketId) == msg.sender, "Ban khong phai chu ve");
        Ticket storage ticket = tickets[ticketId];
        Event storage myEvent = events[ticket.eventId];

        require(!ticket.isUsed, "Ve da su dung khong the ban");
        require(price <= myEvent.maxResellPrice, "Gia ban vuot qua quy dinh cua BTC!"); 

        ticket.isForSale = true;
        ticket.currentPrice = price;
        
        emit TicketListed(ticketId, price);
    }

    
    function buyResellTicket(uint256 ticketId) public payable {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.isForSale, "Ve nay khong ban");
        require(msg.value >= ticket.currentPrice, "Khong du tien");

        address seller = ownerOf(ticketId);
        
        
        (address receiver, uint256 royaltyAmount) = royaltyInfo(ticketId, msg.value);
        uint256 sellerAmount = msg.value - royaltyAmount;

        
        payable(receiver).transfer(royaltyAmount); 
        payable(seller).transfer(sellerAmount);    

        
        _transfer(seller, msg.sender, ticketId);
        
        
        ticket.isForSale = false;
        ticket.currentPrice = 0;

        emit TicketResold(ticketId, seller, msg.sender, msg.value);
    }
}