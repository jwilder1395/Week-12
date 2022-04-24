class Team {
    constructor(name) {
        this.name;
        this.city = [];
    }
    
    addCity(name, state){
        this.cities.push(new City(name, state));
    }
}

class City {
    constructor(name, state) {
        this.name = name;
        this.state= state;
    }
}

class TeamLog { 
    static url = "https://crudcrud.com/api/ea1eaddf94264bd7a55ef40ae69bb2b8";
    
    static getAllTeams() {
        return $.get(this.url);
    }
    
    static getTeam(id) {
        return $.get(this.url + `${id}`);
    }

    static createTeam(team) {
        return $.post(this.url, team);
    }

    static updateTeam(team) {
        return $.ajax({
            url: this.url + `/${team._id}`,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static teams;

    static getAllTeams() {
        TeamLog.getAllTeams().then(teams => this.render(teams));
    }

    static deleteTeam(id) {
        TeamLog.deleteTeam(id)
        .then(() => {
            return TeamLog.deleteTeam();

        })
        .then((teams) => this.render(teams));
    }

    static createTeam(name) {
        TeamLog.createTeam(new Team(name))
        .then(() => {
            return TeamLog.getAllTeams();
        })
        .then((teams) => this.render(teams));
    }

    static addCity(id) {
        for(let team of this.teams){
            if(team._id == id) {
                team.cities.push(new City($(`#${team._id}-city-name`).val(), $(`#${team._id}-city-state`).val())); 
                TeamLog.updateTeam(team)
                .then(()=> {
                    return TeamLog.getAllTeams();
                })
                .then((teams) => this.render(teams));
            
            }
        }
    }

    static deleteCity(teamId, cityId) {
        for(let team of this.teams) {
            if(team._id == teamId) {
                for(let city of team.cities){
                    if(city._id == cityId) {
                        team.cities.splice(team.cities.indexOf(city), 1);
                        TeamLog.updateTeam(team)
                        .then(()=> {
                            return TeamLog.getAllTeams();
                         })
                        .then((teams) => this.render(teams));
                    }
                }
            }
        }
    }

    static render(teams) {
        this.teams = teams; 
        $('#app').empty(); 
        for(let team of teams) {
            $('#app').prepend(
            `<div id="${team._id}" class="card">
                <div class="card-header">
                    <h2>${team.name}</h2> 
                    <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${team._id})-city-name" class="form-control" placeholder="City Name">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${team._id})-city-state" class="form-control" placeholder="City State">
                            </div>
                        </div>
                        <button id="${team._id}-new-city" onclick="DOMManager.addTeam'${team._id}')" 
                        class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
        );

        for(let city of team.cities){
            $(`#${team._id}`).find('.card-body').append(
                `<p>
                    <span id="name-${city._id}"><strong>Name: </strong> ${city.name}</span>
                    <span id="amount-${city._id}><strong>Amount: </strong> ${city.state}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team._id}', 
                    '${city._id}')">Delete City</button>
                `

            )
            
        }
    }
}
}



$('#create-new-team').click(() => {
    DOMManager.createTeam($('#new-team-name').val());
    $('#new-team-name').val(' ');
})


DOMManager.getAllTeams();