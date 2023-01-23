export interface habitProps{
    id: string;
    title: string;
    created_at: Date;
}

export class Habit{
    private props: habitProps;

    get id(): string{
        return this.props.id;
    }


    get title (): string{
        return this.props.title
    }

    get created_at(): Date{
        return this.props.created_At;
    }


    constructor(props: habitProps){
        this.props = props;
    }
}