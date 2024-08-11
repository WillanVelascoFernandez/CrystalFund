//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CrystalFund is Ownable {
    struct Project {
        address creator;
		string causa;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool isActive;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public projectCount = 0;
    uint256 public contractFeePercentage = 5; // 5% fee
    uint256 public maxGoal = 1000 ether; // Goal máximo inicial
    uint256 public maxTime = 365; // Time máximo por recaudación

    event ProjectCreated(uint256 projectId, address creator, string causa, uint256 goal, uint256 deadline);
    event Contributed(uint256 projectId, address contributor, uint256 amount);
    event FundsWithdrawn(uint256 projectId, address creator, uint256 amount);
    event Refunded(uint256 projectId, address contributor, uint256 amount);

    function createProject(string memory _causa, uint256 _goal, uint256 _duration) public {
		require(_goal > 0 && _goal <= maxGoal, "Goal must be greater than 0 and less than or equal to max goal");
		require(_duration > 0 && _duration <= maxTime, "Duration must be between 1 and 365 days");

        uint256 projectId = ++projectCount;

        projects[projectId] = Project({
            creator: msg.sender,
            goal: _goal,
			causa: _causa,
            deadline: block.timestamp + _duration * 1 days,
            amountRaised: 0,
            isActive: true
        });

        emit ProjectCreated(projectId, msg.sender, _causa, _goal, projects[projectId].deadline);
    }

    function contribute(uint256 _projectId) public payable {
        require(projects[_projectId].isActive, "Project is not active");
        require(block.timestamp < projects[_projectId].deadline, "Project deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        projects[_projectId].amountRaised += msg.value;
        contributions[_projectId][msg.sender] += msg.value;

        emit Contributed(_projectId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _projectId) public {
        require(projects[_projectId].creator == msg.sender, "Only project creator can withdraw funds");
        require(block.timestamp >= projects[_projectId].deadline, "Project deadline has not passed");

		uint256 amountToCreator=0;

        uint256 amountRaised = projects[_projectId].amountRaised;
		if (projects[_projectId].amountRaised >= projects[_projectId].goal) {
      		uint256 fee = (amountRaised * contractFeePercentage) / 100;
			amountToCreator = amountRaised - fee;
			payable(owner()).transfer(fee);
    	}else{
			amountToCreator = amountRaised;
		}

        projects[_projectId].amountRaised = 0;
        projects[_projectId].isActive = false;

        
        payable(msg.sender).transfer(amountToCreator);

        emit FundsWithdrawn(_projectId, msg.sender, amountToCreator);
    }

	function setMaxGoal(uint256 _newMaxGoal) public onlyOwner {
        require(_newMaxGoal > 0, "Max goal must be greater than 0");
        maxGoal = _newMaxGoal;
    }

    function setMaxTime(uint256 _newMaxTime) public onlyOwner {
        require(_newMaxTime > 0, "Max time must be greater than 0");
        maxTime = _newMaxTime;
    }

	function getTimeRemaining(uint256 _projectId) public view returns (uint256 daysRemaining, uint256 hoursRemaining, uint256 minutesRemaining, uint256 secondsRemaining) {
    Project storage project = projects[_projectId];

    // Verificar si el proyecto está activo
    require(project.isActive, "Project is not active");

    // Obtener el tiempo restante en segundos
    uint256 timeRemaining = project.deadline > block.timestamp ? project.deadline - block.timestamp : 0;

    // Calcular días, horas, minutos y segundos
    daysRemaining = timeRemaining / 1 days;
    hoursRemaining = (timeRemaining % 1 days) / 1 hours;
    minutesRemaining = (timeRemaining % 1 hours) / 1 minutes;
    secondsRemaining = (timeRemaining % 1 minutes) / 1 seconds;

    return (daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining);
    }

    function getAllProjects() private view returns (uint256[] memory, Project[] memory) {
        uint256[] memory ids = new uint256[](projectCount);
        Project[] memory projectDetails = new Project[](projectCount);

        for (uint256 i = 1; i <= projectCount; i++) {
            ids[i - 1] = i;
            projectDetails[i - 1] = projects[i];
        }

        return (ids, projectDetails);
    }
}