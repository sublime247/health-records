pragma solidity ^0.8.19;

contract HealthRecords {
    struct Record {
        string ipfsHash;
        string fileName;
        uint256 timestamp;
        address patient;
        bool exists;
    }
    
    struct AccessRequest {
        address provider;
        address patient;
        bool approved;
        uint256 timestamp;
        string reason;
    }
    
    // Mappings
    mapping(bytes32 => Record) public records;
    mapping(address => mapping(address => bool)) public accessPermissions;
    mapping(bytes32 => AccessRequest) public accessRequests;
    mapping(address => bytes32[]) public patientRecords;
    mapping(address => bytes32[]) public providerRequests;
    
    // Events
    event RecordStored(bytes32 indexed recordId, address indexed patient, string ipfsHash);
    event AccessRequested(bytes32 indexed requestId, address indexed provider, address indexed patient);
    event AccessGranted(address indexed provider, address indexed patient);
    event AccessRevoked(address indexed provider, address indexed patient);
    
    // Store a new health record
    function storeRecord(string memory _ipfsHash, string memory _fileName) public {
        bytes32 recordId = keccak256(abi.encodePacked(_ipfsHash, msg.sender, block.timestamp));
        
        records[recordId] = Record({
            ipfsHash: _ipfsHash,
            fileName: _fileName,
            timestamp: block.timestamp,
            patient: msg.sender,
            exists: true
        });
        
        patientRecords[msg.sender].push(recordId);
        
        emit RecordStored(recordId, msg.sender, _ipfsHash);
    }
    
    // Request access to patient records
    function requestAccess(address _patient, string memory _reason) public {
        require(_patient != msg.sender, "Cannot request access to own records");
        
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, _patient, block.timestamp));
        
        accessRequests[requestId] = AccessRequest({
            provider: msg.sender,
            patient: _patient,
            approved: false,
            timestamp: block.timestamp,
            reason: _reason
        });
        
        providerRequests[msg.sender].push(requestId);
        
        emit AccessRequested(requestId, msg.sender, _patient);
    }
    
    // Grant access to a provider
    function grantAccess(address _provider) public {
        accessPermissions[msg.sender][_provider] = true;
        emit AccessGranted(_provider, msg.sender);
    }
    
    // Revoke access from a provider
    function revokeAccess(address _provider) public {
        accessPermissions[msg.sender][_provider] = false;
        emit AccessRevoked(_provider, msg.sender);
    }
    
    // Check if provider has access to patient records
    function checkAccess(address _patient, address _provider) public view returns (bool) {
        return accessPermissions[_patient][_provider];
    }
    
    // Get patient's records (only if caller has access)
    function getPatientRecords(address _patient) public view returns (bytes32[] memory) {
        require(
            msg.sender == _patient || accessPermissions[_patient][msg.sender],
            "Access denied"
        );
        return patientRecords[_patient];
    }
    
    // Get record details
    function getRecord(bytes32 _recordId) public view returns (Record memory) {
        Record memory record = records[_recordId];
        require(record.exists, "Record does not exist");
        require(
            msg.sender == record.patient || accessPermissions[record.patient][msg.sender],
            "Access denied"
        );
        return record;
    }
    
    // Get provider's access requests
    function getProviderRequests(address _provider) public view returns (bytes32[] memory) {
        require(msg.sender == _provider, "Access denied");
        return providerRequests[_provider];
    }
}
