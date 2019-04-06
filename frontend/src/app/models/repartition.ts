export class Proposition {
	public id: number;
	public name: string;
	public min: number;
	public max: number;
	
	clone(): Proposition 
	{
		var n = new Proposition();
		n.id = this.id;
		n.name = ""+this.name;
		n.min = this.min;
		n.max = this.max;
		return n;
	}
}

export class Repartition {
    public id: number;
    public status: number;
    public promotion: string;
    public title: string;
    public equirepartition: boolean;
    public propositions: Proposition[];
    public progress: any;
    public voeux: number[];
    public resultat: number;

    clone(): Repartition
    {
    	var n = new Repartition();
    	n.id = this.id;
		n.status = this.status;
		n.promotion = ""+this.promotion;
		n.title = ""+this.title;;
		n.equirepartition = this.equirepartition;
		n.propositions = [];
		for(let a of this.propositions)
		{
			n.propositions.push(a.clone());
		}
		return n;
    }
}
