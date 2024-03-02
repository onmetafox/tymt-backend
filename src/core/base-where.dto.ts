export class BaseWhereDto{
    [item: string]: any;
    page: number = 1;

    constructor(params: {} | null){
        if(params){
            Object.entries(params).forEach(([key, value])=>{
                this[key] = value
            })
        }
    }
}