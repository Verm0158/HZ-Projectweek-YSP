import bigCartesian from '../node_modules/big-cartesian/build/src/main.js';
import fastCartesian from '../node_modules/fast-cartesian/build/src/main.js'

window.addEventListener("load", init);

async function init() {
    document.getElementById("addMachineButton").addEventListener("click", function() {
        addMachine();
    });
    document.getElementById("setMachineTemplateButton").addEventListener("click", function() {
        setMachineTemplate();
    })
    document.getElementById("clearMachineTable").addEventListener("click", function() {
        clearMachineTable();
    })
    document.getElementById("solarPanelOutputTemplateButton").addEventListener("click", function() {
        setSolarPanelOutputTemplate();
    })
    document.getElementById("clearSolarPanelOutputs").addEventListener("click", function() {
        clearSolarPanelOutputs()
    })
    document.getElementById("makeIndividualSchedule").addEventListener("click", function() {
        scheduleMachinesIndividually();
    });
    document.getElementById("makeGroupedSchedule").addEventListener("click", function() {
        const groupSize = document.getElementById("groupSizeInput").value;
        const method = document.getElementById("groupSortMethod").value;

        scheduleMachinesInGroupsOfX(groupSize, method);
    });
    document.getElementById("anticipateSolarPanelOutput").addEventListener("click", function() {
        anticipateSolarPanelOutput();
    })

}

function addMachine() {
    const name = document.getElementById("machineNameInput").value;
    const energyUsage = document.getElementById("machineEnergyUsageInput").value;
    const hoursUsage = document.getElementById("machineHoursUsageInput").value;
    if(!(addMachineErrorResolver(name, energyUsage, hoursUsage))) {
        appendMachineToTable(name, energyUsage, hoursUsage);
    };
}

function addMachineErrorResolver(name, energyUsage, hoursUsage) {
    clearMachineErrors();
    let encounteredError = false;
    let encounteredNameInputError = false;
    let encounteredEnergyUsageInputError = false;
    let encounteredHoursUsageInputError = false;
    let allMachineNames = [];
    for (let index = 0; index < document.getElementsByClassName("machineTableNameField").length; index++) {
        allMachineNames.push(document.getElementsByClassName("machineTableNameField")[index].innerHTML);
    }
    const hoursInDay = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", ]

    if(name === null || name == undefined || name === "") {
        const errorDisplay = document.getElementById("machineNameInputErrorDisplay");
        errorDisplay.append("Machine must have a name.");
        encounteredNameInputError = true;
    }
    for (let index = 0; index < allMachineNames.length; index++) {
        if(name === allMachineNames[index]) {
            const errorDisplay = document.getElementById("machineNameInputErrorDisplay");
            if(encounteredNameInputError) {
                errorDisplay.append(" Machine's name must be unique.");
            } else {
                errorDisplay.append("Machine's name must be unique.");
            }
            encounteredNameInputError = true;
        }
    }

    if(energyUsage === null || energyUsage == undefined || energyUsage === "") {
        const errorDisplay = document.getElementById("machineEnergyUsageInputErrorDisplay");
        errorDisplay.append("Machine must have a power usage.");
        encounteredEnergyUsageInputError = true;
    }
    if(energyUsage === 0 || energyUsage === "0") {
        const errorDisplay = document.getElementById("machineEnergyUsageInputErrorDisplay");
        if(encounteredEnergyUsageInputError) {
            errorDisplay.append(" Machine's power usage cannot be 0.");
        } else {
            errorDisplay.append("Machine's power usage cannot be 0.");
        }
        encounteredEnergyUsageInputError = true;
    }
    if(!(/^\d+$/.test(energyUsage))) {
        const errorDisplay = document.getElementById("machineEnergyUsageInputErrorDisplay");
        if(encounteredEnergyUsageInputError) {
            errorDisplay.append(" Machine's power usage must contain only numbers.");
        } else {
            errorDisplay.append("Machine's power usage must contain only numbers.");
        }
        encounteredEnergyUsageInputError = true;
    }
    if(energyUsage[0] === "0" && energyUsage.length > 1) {
        const errorDisplay = document.getElementById("machineEnergyUsageInputErrorDisplay");
        if(encounteredEnergyUsageInputError) {
            errorDisplay.append(" Machine's power usage cannot start with 0 if other numbers follow.");
        } else {
            errorDisplay.append("Machine's power usage cannot start with 0 if other numbers follow.");
        }
        encounteredEnergyUsageInputError = true;
    }
    
    if(hoursUsage === null || hoursUsage == undefined || hoursUsage === "" || hoursUsage === 0 || hoursUsage === "0") {
        const errorDisplay = document.getElementById("machineHoursUsageInputErrorDisplay")
        errorDisplay.append("Machine must run for some time (no empty string or a usage of 0 hours accepted).");
        encounteredHoursUsageInputError = true;
    }
    if(!(/^\d+$/.test(hoursUsage))) {
        const errorDisplay = document.getElementById("machineHoursUsageInputErrorDisplay")
        if(encounteredHoursUsageInputError) {
            errorDisplay.append(" Machine runtime must contain only numbers.");
        } else {
            errorDisplay.append("Machine runtime must contain only numbers.");
        }
        encounteredHoursUsageInputError = true;
    }
    let numberBetween1And24 = false;
    for (let index = 0; index < hoursInDay.length; index++) {
        if(hoursUsage === hoursInDay[index]) {
            numberBetween1And24 = true;
        }
    }
    if(!numberBetween1And24) {
        const errorDisplay = document.getElementById("machineHoursUsageInputErrorDisplay")
        if(encounteredHoursUsageInputError) {
            errorDisplay.append(" Machine runtime must lie between 1 and 24 hours.");
        } else {
            errorDisplay.append("Machine runtime must lie between 1 and 24 hours.");
        }
        encounteredHoursUsageInputError = true;
    }

    if(encounteredNameInputError || encounteredEnergyUsageInputError || encounteredHoursUsageInputError) {
        encounteredError = true;
    }
    return encounteredError;
};

function clearMachineErrors() {
    document.getElementById("machineNameInputErrorDisplay").innerHTML = "";
    document.getElementById("machineEnergyUsageInputErrorDisplay").innerHTML = "";
    document.getElementById("machineHoursUsageInputErrorDisplay").innerHTML = "";
}

function appendMachineToTable(name, energyUsage, hoursUsage) {
    const row = document.createElement("tr");
    const nameField = document.createElement("td");
    const energyUsageField = document.createElement("td");
    const hoursUsageField = document.createElement("td");
    const removeField = document.createElement("td");
    const removeButton = document.createElement("button");

    nameField.innerHTML = `${name}`;
    nameField.classList = `machineTableNameField`;
    nameField.id = `${name}NameField`;
    row.append(nameField);

    energyUsageField.innerHTML = `${energyUsage}`;
    energyUsageField.classList = `machineTableEnergyUsageField`;
    energyUsageField.id = `${name}energyUsageField`;
    row.append(energyUsageField);

    hoursUsageField.innerHTML = `${hoursUsage}`;
    hoursUsageField.classList = `machineTableHourUsageField`;
    hoursUsageField.id = `${name}hoursUsageField`;
    row.append(hoursUsageField);
        
    removeButton.addEventListener("click", function() {
        removeElementWithId(name);
    })
    removeField.append(removeButton);
    row.append(removeField);

    row.classList = "machineTableRow";
    row.id = `${name}`;

    document.getElementById("machineTable").append(row);
}

function clearMachineTable() {
    const allMachineRows = document.getElementsByClassName("machineTableRow");
    for (let index = 0; index < 1; index++) {
        if(allMachineRows.length !== 0) {
            removeElementWithId(allMachineRows[index].id);
            index--
        }
    }
}

function setMachineTemplate() {
    const template = document.getElementById("machineTemplateOptions").value;

    clearMachineTable()

    if(template === "test") {
        appendMachineToTable("1", "10", "5");
        appendMachineToTable("2", "20", "6");
        appendMachineToTable("3", "30", "7");
    } else if (template === "engravers") {
        appendMachineToTable("Engraving 1", "1500", "6");
        appendMachineToTable("Engraving 2", "1500", "5");
        appendMachineToTable("Engraving 3", "1500", "4");
        appendMachineToTable("Engraving 4", "1500", "6");
        appendMachineToTable("Engraving 5", "1500", "4");
    } else if (template === "allMachines") {
        appendMachineToTable("Engraving 1", "1500", "6");
        appendMachineToTable("Engraving 2", "1500", "5");
        appendMachineToTable("Engraving 3", "1500", "4");
        appendMachineToTable("Engraving 4", "1500", "6");
        appendMachineToTable("Engraving 5", "1500", "4");
        appendMachineToTable("Ricoh Z75 printer", "20000", "6");
        appendMachineToTable("Motion Laser Cutter Pro", "10000", "5");
        appendMachineToTable("Press 1", "2000", "6");
        appendMachineToTable("Press 2", "2000", "5");
        appendMachineToTable("Big Press 1", "4000", "3");
        appendMachineToTable("Big Press 2", "4000", "3");
        appendMachineToTable("Cutting table", "2000", "2");
        appendMachineToTable("Chocolate printer", "2400", "2");
        appendMachineToTable("Canvas maker", "1000", "5");
        appendMachineToTable("Computer 1", "500", "8");
        appendMachineToTable("Textile print and press", "5400", "4");
        appendMachineToTable("Mug oven", "7500", "5");
        appendMachineToTable("Mug press 1", "2500", "3");
        appendMachineToTable("Mug press 2", "2500", "3");
    }
}

function solarPanelOutputErrorResolver(solarPanelOutputs) {
    const errorDisplay = document.getElementById("solarPanelOutputErrorDisplay");
    errorDisplay.innerHTML = "";

    let encounteredError = false;

    for (let index = 0; index < solarPanelOutputs.length; index++) {
        if(solarPanelOutputs[index] === undefined || solarPanelOutputs[index] === null || solarPanelOutputs[index] === "") {
            errorDisplay.append("Solar panel output cannot be empty (must contain a number, even if that number is 0).");
            encounteredError = true;
        }
        if(!(/^\d+$/.test(solarPanelOutputs[index]))) {
            if(encounteredError) {
                errorDisplay.append(" Solar panel output must contain only numbers.");
            } else {
                errorDisplay.append("Solar panel output must contain only numbers.");
            }
            encounteredError = true;
        }
    }

    return encounteredError;
}

function anticipateSolarPanelOutput() {
    const solarPanelOutputInputs = document.getElementsByClassName("solarPanelOutputInput");
    for (let index = 0; index < solarPanelOutputInputs.length; index++) {
        if(index < 8) {
            solarPanelOutputInputs[index].value = "0";
        } else if (index === 8) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(8000, 16000);
        } else if (index === 9) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(10000, 32000);
        } else if (index === 10) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(12000, 34000);
        } else if (index === 11) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(16100, 46000);
        } else if (index === 12) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(18000, 57000);
        } else if (index === 13) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(15500, 46500);
        } else if (index === 14) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(35000, 66500);
        } else if (index === 15) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(32000, 57600);
        } else if (index === 16) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(9000, 17000);
        } else if (index === 17) {
            solarPanelOutputInputs[index].value = randomIntegerInsideRange(2500, 8000);
        } else {
            solarPanelOutputInputs[index].value = "0";
        }
    }
}

function setSolarPanelOutputTemplate() {
    const template = document.getElementById("solarPanelOutputTemplateOptions").value;

    if(template === "test") {
        setSolarPanelOutputs([0, 10, 10, 10, 10, 10, 0, 10, 10, 10, 10, 30, 40, 50, 20, 10, 10, 0, 0, 0, 0, 0, 0, 0])
    } else if (template === "2/11/2023") {
        setSolarPanelOutputs([0, 0, 0, 0, 0, 0, 0, 0, 16000, 16000, 12000, 16100, 39000, 18600, 66500, 41600, 11000, 2500, 0, 0, 0, 0, 0, 0])
    } else if (template === "3/11/2023") {
        setSolarPanelOutputs([0, 0, 0, 0, 0, 0, 0, 0, 12000, 20000, 18000, 25300, 57000, 46500, 17500, 57600, 13000, 6000, 0, 0, 0, 0, 0, 0])
    }
}

function setSolarPanelOutputs(solarPanelsOutputByHour) {
    let solarPanelOutputInputs = document.getElementsByClassName("solarPanelOutputInput");

    for (let index = 0; index < solarPanelsOutputByHour.length; index++) {
        solarPanelOutputInputs[index].value = solarPanelsOutputByHour[index];
    }
}

function clearSolarPanelOutputs() {
    setSolarPanelOutputs([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
}

function scheduleMachinesIndividually() {
    let solarPanelsAllOutputsByHour = []
    for (let index = 0; index < document.getElementsByClassName("solarPanelOutputInput").length; index++) {
        solarPanelsAllOutputsByHour.push(document.getElementsByClassName("solarPanelOutputInput")[index].value)
    };

    if(!(solarPanelOutputErrorResolver(solarPanelsAllOutputsByHour))) {
        let schedule = []
        for (let index = 0; index < solarPanelsAllOutputsByHour.length; index++) {
            schedule.push({
                "solarPanelOutput": solarPanelsAllOutputsByHour[index],
                "machines": [],
                "machineEnergyUsage": 0,
                "energyBalance": solarPanelsAllOutputsByHour[index],
            })
        }

        let allMachineNames = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableNameField").length; index++) {
            allMachineNames.push(document.getElementsByClassName("machineTableNameField")[index].innerHTML);
        }
        let allMachinePowerUsages = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableEnergyUsageField").length; index++) {
            allMachinePowerUsages.push(document.getElementsByClassName("machineTableEnergyUsageField")[index].innerHTML);
        }
        let allMachineHourUsages = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableHourUsageField").length; index++) {
            allMachineHourUsages.push(document.getElementsByClassName("machineTableHourUsageField")[index].innerHTML);
        }

        let allMachines = [];
        for (let index = 0; index < allMachineNames.length; index++) {
            allMachines.push({
                "name": allMachineNames[index],
                "powerUsage": allMachinePowerUsages[index],
                "hourUsage": allMachineHourUsages[index],
            });
        }

        const possibleStartTimesAppendedToMachineIndex = [];
        for (let index = 0; index < allMachines.length; index++) {
            let allPossibilitiesForSpecificMachineIndex = [];
            for (let startTime = 0; startTime <= 24 - allMachines[index].hourUsage; startTime++) {
                allPossibilitiesForSpecificMachineIndex.push(`${index}+${startTime}`)
            }
            possibleStartTimesAppendedToMachineIndex.push(allPossibilitiesForSpecificMachineIndex);
        }

        let mostEfficientScheduleTotalDistanceFrom0 = undefined;
        let mostEfficientScheduleYet = [];

        //for (const values of fastCartesian(possibleStartTimesAppendedToMachineIndex)) {
        //    console.log(values);
        //}
        //console.log(fastCartesian(possibleStartTimesAppendedToMachineIndex),)

        for (const values of bigCartesian(possibleStartTimesAppendedToMachineIndex)) {
            let testSchedule = structuredClone(schedule);
            let testScheduleTotalDistanceFrom0 = 0;
            for (let index = 0; index < values.length; index++) {
                for (let hours = 0; hours < allMachines[index].hourUsage; hours++) {
                    testSchedule[Number(values[index].substr(2, 3)) + hours].machines.push(allMachines[index]);
                    testSchedule[Number(values[index].substr(2, 3)) + hours].machineEnergyUsage += Number(allMachines[index].powerUsage);
                    testSchedule[Number(values[index].substr(2, 3)) + hours].energyBalance -= Number(allMachines[index].powerUsage);
                }
            }
            for (let index = 0; index < testSchedule.length; index++) {
                testScheduleTotalDistanceFrom0 += Math.abs(Number(testSchedule[index].energyBalance));
            }

            if(mostEfficientScheduleTotalDistanceFrom0 > testScheduleTotalDistanceFrom0 || mostEfficientScheduleTotalDistanceFrom0 === undefined || mostEfficientScheduleTotalDistanceFrom0 === null) {
                mostEfficientScheduleTotalDistanceFrom0 = testScheduleTotalDistanceFrom0;
                mostEfficientScheduleYet = testSchedule;
            }
        }

        console.log(mostEfficientScheduleYet);
        clearScheduleTable();
        appendScheduleToTable(mostEfficientScheduleYet);
        document.getElementById("totalDistanceFrom0").innerHTML = `${mostEfficientScheduleTotalDistanceFrom0}`;
    }
}

function scheduleMachinesInGroupsOfX(groupSize, method) {
    let solarPanelsAllOutputsByHour = []
    for (let index = 0; index < document.getElementsByClassName("solarPanelOutputInput").length; index++) {
        solarPanelsAllOutputsByHour.push(document.getElementsByClassName("solarPanelOutputInput")[index].value)
    };

    if(!(solarPanelOutputErrorResolver(solarPanelsAllOutputsByHour)) && !(scheduleMachinesInGroupsErrorResolver(groupSize, method))) {
        let schedule = []
        for (let index = 0; index < solarPanelsAllOutputsByHour.length; index++) {
            schedule.push({
                "solarPanelOutput": solarPanelsAllOutputsByHour[index],
                "machines": [],
                "machineEnergyUsage": 0,
                "energyBalance": solarPanelsAllOutputsByHour[index],
            })
        }

        let allMachineNames = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableNameField").length; index++) {
            allMachineNames.push(document.getElementsByClassName("machineTableNameField")[index].innerHTML);
        }
        let allMachinePowerUsages = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableEnergyUsageField").length; index++) {
            allMachinePowerUsages.push(document.getElementsByClassName("machineTableEnergyUsageField")[index].innerHTML);
        }
        let allMachineHourUsages = [];
        for (let index = 0; index < document.getElementsByClassName("machineTableHourUsageField").length; index++) {
            allMachineHourUsages.push(document.getElementsByClassName("machineTableHourUsageField")[index].innerHTML);
        }

        let allMachines = [];
        for (let index = 0; index < allMachineNames.length; index++) {
            allMachines.push({
                "name": allMachineNames[index],
                "powerUsage": allMachinePowerUsages[index],
                "hourUsage": allMachineHourUsages[index],
            });
        }

        let groupedMachines = [];
        let amountOfCompleteGroups = Math.floor(allMachines.length / groupSize);
        let remainingMachines = allMachines.length % groupSize;

        let possibleIndexes = [];
        for (let index = 0; index < allMachines.length; index++) {
            possibleIndexes.push(index);
        }

        if(method === "lowToHighEnergyUsage") {
            allMachines.sort(dynamicSort("powerUsage", true))
        }

        for (let i = 0; i <= amountOfCompleteGroups; i++) {
            if(method === "index") {
                if(!(i === amountOfCompleteGroups)) {
                    let machinesToGroup = [];
                    for (let j = 0; j < groupSize; j++) {
                        machinesToGroup.push(allMachines[(i * groupSize) + j]);
                    }
                    groupedMachines.push(machinesToGroup);
                } else if (remainingMachines !== 0) {
                    let machinesToGroup = [];
                    for (let j = 0; j < remainingMachines; j++) {
                        machinesToGroup.push(allMachines[(allMachines.length - remainingMachines) + j]);
                    }
                    groupedMachines.push(machinesToGroup);
                }
            }
            if(method === "random") {
                if(!(i === amountOfCompleteGroups)) {
                    let machinesToGroup = [];
                    for (let j = 0; j < groupSize; j++) {
                        const randomIndexForRandomIndex = randomIntegerInsideRange(0, possibleIndexes.length - 1); // Please laugh
                        machinesToGroup.push(allMachines[possibleIndexes[randomIndexForRandomIndex]]);
                        possibleIndexes.splice(randomIndexForRandomIndex, 1);
                    }
                    groupedMachines.push(machinesToGroup);
                } else if (remainingMachines !== 0) {
                    let machinesToGroup = [];
                    for (let j = 0; j < remainingMachines; j++) {
                        const randomIndexForRandomIndex = randomIntegerInsideRange(0, possibleIndexes.length - 1); // Or cry
                        machinesToGroup.push(allMachines[possibleIndexes[randomIndexForRandomIndex]]);
                        possibleIndexes.splice(randomIndexForRandomIndex, 1);
                    }
                    groupedMachines.push(machinesToGroup);
                }
            }
            if(method === "lowToHighEnergyUsage") {
                if(!(i === amountOfCompleteGroups)) {
                    let machinesToGroup = [];
                    for (let j = 0; j < groupSize; j++) {
                        machinesToGroup.push(allMachines[(i * groupSize) + j]);
                    }
                    groupedMachines.push(machinesToGroup);
                } else if (remainingMachines !== 0) {
                    let machinesToGroup = [];
                    for (let j = 0; j < remainingMachines; j++) {
                        machinesToGroup.push(allMachines[(allMachines.length - remainingMachines) + j]);
                    }
                    groupedMachines.push(machinesToGroup);
                }
            }
        }

        // groups will start at the same time (assumption)
        console.log(groupedMachines);

        const possibleStartTimesAppendedToGroupIndex = [];
        for (let index = 0; index < groupedMachines.length; index++) {
            let allPossibilitiesForSpecificGroupIndex = [];
            for (let startTime = 0; startTime <= 24 - (groupedMachines[index].sort(dynamicSort("hourUsage", true)))[groupedMachines[index].length - 1].hourUsage; startTime++) {
                allPossibilitiesForSpecificGroupIndex.push(`${index}+${startTime}`)
            }
            possibleStartTimesAppendedToGroupIndex.push(allPossibilitiesForSpecificGroupIndex);
        }

        let mostEfficientScheduleTotalDistanceFrom0 = undefined;
        let mostEfficientScheduleYet = [];

        //for (const values of fastCartesian(possibleStartTimesAppendedToMachineIndex)) {
        //    console.log(values);
        //}
        //console.log(fastCartesian(possibleStartTimesAppendedToMachineIndex),)

        for (const values of bigCartesian(possibleStartTimesAppendedToGroupIndex)) {
            let testSchedule = structuredClone(schedule);
            let testScheduleTotalDistanceFrom0 = 0;
            for (let index = 0; index < values.length; index++) {
                for (let i = 0; i < groupedMachines[index].length; i++) {
                    const currentMachine = groupedMachines[index][i];
                    for (let hours = 0; hours < currentMachine.hourUsage; hours++) {
                        testSchedule[Number(values[index].substr(2, 3)) + hours].machines.push(currentMachine);
                        testSchedule[Number(values[index].substr(2, 3)) + hours].machineEnergyUsage += Number(currentMachine.powerUsage);
                        testSchedule[Number(values[index].substr(2, 3)) + hours].energyBalance -= Number(currentMachine.powerUsage);
                    }
                }
            }
            for (let index = 0; index < testSchedule.length; index++) {
                testScheduleTotalDistanceFrom0 += Math.abs(Number(testSchedule[index].energyBalance));
            }

            if(mostEfficientScheduleTotalDistanceFrom0 > testScheduleTotalDistanceFrom0 || mostEfficientScheduleTotalDistanceFrom0 === undefined || mostEfficientScheduleTotalDistanceFrom0 === null) {
                mostEfficientScheduleTotalDistanceFrom0 = testScheduleTotalDistanceFrom0;
                mostEfficientScheduleYet = testSchedule;
            }
        }
        console.log(mostEfficientScheduleYet);
        clearScheduleTable();
        appendScheduleToTable(mostEfficientScheduleYet);
        document.getElementById("totalDistanceFrom0").innerHTML = `${mostEfficientScheduleTotalDistanceFrom0}`;
    }
}

function scheduleMachinesInGroupsErrorResolver(groupSize, method) {
    const errorDisplay = document.getElementById("scheduleByGroupErrorDisplay");
    errorDisplay.innerHTML = "";

    let encounteredError = false;
    
    if(groupSize === undefined || groupSize === null || groupSize === "") {
        errorDisplay.append("Group size cannot be empty.");
        encounteredError = true;
    }
    if(groupSize === 0 || groupSize === "0") {
        if(encounteredError) {
            errorDisplay.append(" Group size cannot be 0.");
        } else {
            errorDisplay.append("Group size cannot be 0.");
        }
        encounteredError = true;
    }
    if(!(/^\d+$/.test(groupSize))) {
        if(encounteredError) {
            errorDisplay.append(" Group size must contain only numbers.");
        } else {
            errorDisplay.append("Group size must contain only numbers.");
        }
        encounteredError = true;
    }
    if(groupSize[0] === "0" && groupSize.length > 1) {
        if(encounteredError) {
            errorDisplay.append(" Group size cannot start with 0 if other numbers follow.");
        } else {
            errorDisplay.append("Group size cannot start with 0 if other numbers follow.");
        }
        encounteredError = true;
    }

    if(!(method === "index" || method === "random" || method === "lowToHighEnergyUsage")) {
        if(encounteredError) {
            errorDisplay.append(" Method is not valid.");
        } else {
            errorDisplay.append("Method is not valid.");
        }
        encounteredError = true;
    }

    return encounteredError;
}

function appendScheduleToTable(schedule) {
    for (let index = 0; index < schedule.length; index++) {
        const row = document.createElement("tr");
        const startTimeField = document.createElement("td");
        const machinesField = document.createElement("td");
        const solarPanelOutputField = document.createElement("td");
        const energyUsageField = document.createElement("td");
        const energyBalanceField = document.createElement("td");

        if (index < 10) {
            startTimeField.innerHTML = `0${index}:00:00`;
        } else {
            startTimeField.innerHTML = `${index}:00:00`;
        }
        startTimeField.classList = `scheduleTableStartTimeField`;
        row.append(startTimeField);

        for (let i = 0; i < schedule[index].machines.length; i++) {
            machinesField.append(`${schedule[index].machines[i].name}. `);
        }
        machinesField.classList = `scheduleTableMachinesField`;
        row.append(machinesField);

        solarPanelOutputField.innerHTML = `${schedule[index].solarPanelOutput}`;
        solarPanelOutputField.classList = `scheduleTableSolarPanelOutputField`;
        row.append(solarPanelOutputField);

        energyUsageField.innerHTML = `${schedule[index].machineEnergyUsage}`;
        energyUsageField.classList = `scheduleTableEnergyUsageField`;
        row.append(energyUsageField);

        energyBalanceField.innerHTML = `${schedule[index].energyBalance}`;
        energyBalanceField.classList = `scheduleTableEnergyBalanceField`;
        row.append(energyBalanceField);

        row.classList = "scheduleTableRow";
        row.id = `scheduleTableRow${index + 1}`;

        document.getElementById("scheduleTable").append(row);
    }
}

function clearScheduleTable() {
    const allScheduleRows = document.getElementsByClassName("scheduleTableRow");
    for (let index = 0; index < 1; index++) {
        if(allScheduleRows.length !== 0) {
            removeElementWithId(allScheduleRows[index].id);
            index--
        }
    }
}

function randomIntegerInsideRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function removeElementWithId(id) {
    document.getElementById(id).remove();
}

function dynamicSort(property, stringShouldBeNumber) {
    if (stringShouldBeNumber === true) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
            * and you may want to customize it to your needs
            */
            var result = (Number(a[property]) < Number(b[property])) ? -1 : (Number(a[property]) > Number(b[property])) ? 1 : 0;
            return result * sortOrder;
        }
    } else {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
            * and you may want to customize it to your needs
            */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}