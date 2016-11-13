import { Position } from "Position";
class Player {
    constructor(name){
        this.name = name;
        this.position = new Position(0, 0);
        color: "red";
    }

    render(ctx){
        console.log(this.position);
    }
}

